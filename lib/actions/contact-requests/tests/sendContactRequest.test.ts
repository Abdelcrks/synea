import { describe, it, expect, vi, beforeEach } from "vitest";

// ✅ évite le crash Next "outside request scope"
vi.mock("next/headers", () => ({
  headers: async () => new Headers(),
}));
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

const { dbMock, revalidatePathMock, requireActiveSessionMock } = vi.hoisted(() => {
  return {
    revalidatePathMock: vi.fn(),
    requireActiveSessionMock: vi.fn(),
    dbMock: {
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
    },
  };
});

vi.mock("next/cache", () => ({
  revalidatePath: (path: string) => revalidatePathMock(path),
}));

// ⚠️ garde ce mock, mais même s'il rate, on ne crash plus grâce au mock next/headers
vi.mock("@/lib/actions/auth/requireActiveSession", () => ({
    requireActiveSession: () => requireActiveSessionMock(),
  }));

vi.mock("@/lib/db/drizzle", () => ({
  db: dbMock,
}));

import { sendContactRequest } from "../sendContactRequest";

function mockSelectLimit(rows: unknown[]) {
  const limit = vi.fn().mockResolvedValue(rows);
  const where = vi.fn(() => ({ limit }));
  const from = vi.fn(() => ({ where, limit }));
  const select = vi.fn(() => ({ from }));
  return { select };
}

function mockSelectOrderLimit(rows: unknown[]) {
  const limit = vi.fn().mockResolvedValue(rows);
  const orderBy = vi.fn(() => ({ limit }));
  const where = vi.fn(() => ({ orderBy, limit }));
  const from = vi.fn(() => ({ where }));
  const select = vi.fn(() => ({ from }));
  return { select };
}

function mockUpdateOk() {
  const where = vi.fn().mockResolvedValue(undefined);
  const set = vi.fn(() => ({ where }));
  const update = vi.fn(() => ({ set }));
  return { update, set };
}

function mockInsertOk() {
  const values = vi.fn().mockResolvedValue(undefined);
  const insert = vi.fn(() => ({ values }));
  return { insert, values };
}

beforeEach(() => {
  vi.clearAllMocks();
  requireActiveSessionMock.mockResolvedValue({ user: { id: "me" } });
});

describe("sendContactRequest", () => {
  it("not_found si toUserId vide", async () => {
    const res = await sendContactRequest("   ");
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.field).toBe("not_found");
  });

  it("forbidden si on s'envoie une demande à soi-même", async () => {
    const res = await sendContactRequest("me");
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.field).toBe("forbidden");
  });

  it("not_found si targetUser introuvable / indisponible", async () => {
    dbMock.select.mockImplementationOnce(mockSelectLimit([]).select);

    const res = await sendContactRequest("target");
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.field).toBe("not_found");
  });

  it("forbidden si mon profil introuvable", async () => {
    dbMock.select.mockImplementationOnce(mockSelectLimit([{ id: "target" }]).select);
    dbMock.select.mockImplementationOnce(mockSelectLimit([]).select);

    const res = await sendContactRequest("target");
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.field).toBe("forbidden");
  });

  it("not_found si targetProfile introuvable / non visible", async () => {
    dbMock.select.mockImplementationOnce(mockSelectLimit([{ id: "target" }]).select);
    dbMock.select.mockImplementationOnce(mockSelectLimit([{ userId: "me", role: "pair" }]).select);
    dbMock.select.mockImplementationOnce(mockSelectLimit([]).select);

    const res = await sendContactRequest("target");
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.field).toBe("not_found");
  });

  it("already_exists si existing pending", async () => {
    dbMock.select.mockImplementationOnce(mockSelectLimit([{ id: "target" }]).select);
    dbMock.select.mockImplementationOnce(mockSelectLimit([{ userId: "me", role: "pair" }]).select);
    dbMock.select.mockImplementationOnce(mockSelectLimit([{ userId: "target", role: "hero", isVisible: true }]).select);

    dbMock.select.mockImplementationOnce(
      mockSelectOrderLimit([{ id: 1, fromUserId: "me", toUserId: "target", status: "pending" }]).select
    );

    const res = await sendContactRequest("target");
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.field).toBe("already_exists");
  });

  it("canceled direct => relance (update->pending), pas d'insert", async () => {
    dbMock.select.mockImplementationOnce(mockSelectLimit([{ id: "target" }]).select);
    dbMock.select.mockImplementationOnce(mockSelectLimit([{ userId: "me", role: "pair" }]).select);
    dbMock.select.mockImplementationOnce(mockSelectLimit([{ userId: "target", role: "hero", isVisible: true }]).select);

    dbMock.select.mockImplementationOnce(
      mockSelectOrderLimit([{ id: 99, fromUserId: "me", toUserId: "target", status: "canceled" }]).select
    );

    const upd = mockUpdateOk();
    dbMock.update.mockImplementation(upd.update);

    const res = await sendContactRequest("target");
    expect(res.ok).toBe(true);

    expect(dbMock.update).toHaveBeenCalledTimes(1);
    expect(upd.set).toHaveBeenCalledWith(expect.objectContaining({ status: "pending", respondedAt: null }));
    expect(dbMock.insert).not.toHaveBeenCalled();
    expect(revalidatePathMock).toHaveBeenCalled();
  });

  it("canceled reverse => insert une nouvelle demande", async () => {
    dbMock.select.mockImplementationOnce(mockSelectLimit([{ id: "target" }]).select);
    dbMock.select.mockImplementationOnce(mockSelectLimit([{ userId: "me", role: "pair" }]).select);
    dbMock.select.mockImplementationOnce(mockSelectLimit([{ userId: "target", role: "hero", isVisible: true }]).select);

    dbMock.select.mockImplementationOnce(
      mockSelectOrderLimit([{ id: 55, fromUserId: "target", toUserId: "me", status: "canceled" }]).select
    );

    const ins = mockInsertOk();
    dbMock.insert.mockImplementation(ins.insert);

    const res = await sendContactRequest("target");
    expect(res.ok).toBe(true);

    expect(dbMock.insert).toHaveBeenCalledTimes(1);
    expect(ins.values).toHaveBeenCalledWith(
      expect.objectContaining({ fromUserId: "me", toUserId: "target", status: "pending" })
    );
  });

  it("insert throw (unique) => already_exists", async () => {
    dbMock.select.mockImplementationOnce(mockSelectLimit([{ id: "target" }]).select);
    dbMock.select.mockImplementationOnce(mockSelectLimit([{ userId: "me", role: "pair" }]).select);
    dbMock.select.mockImplementationOnce(mockSelectLimit([{ userId: "target", role: "hero", isVisible: true }]).select);

    dbMock.select.mockImplementationOnce(mockSelectOrderLimit([]).select);

    const values = vi.fn().mockRejectedValue(new Error("duplicate key value violates unique constraint"));
    dbMock.insert.mockReturnValue({ values });

    const res = await sendContactRequest("target");
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.field).toBe("already_exists");
  });

  it("forbidden si existing rejected", async () => {
    // 1) targetUser
    dbMock.select.mockImplementationOnce(mockSelectLimit([{ id: "target" }]).select);
    // 2) myProfile
    dbMock.select.mockImplementationOnce(mockSelectLimit([{ userId: "me", role: "pair" }]).select);
    // 3) targetProfile
    dbMock.select.mockImplementationOnce(
      mockSelectLimit([{ userId: "target", role: "hero", isVisible: true }]).select
    );
  
    // 4) existing rejected
    dbMock.select.mockImplementationOnce(
      mockSelectOrderLimit([{ id: 2, fromUserId: "target", toUserId: "me", status: "rejected" }]).select
    );
  
    const res = await sendContactRequest("target");
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.field).toBe("forbidden");
  
    expect(dbMock.insert).not.toHaveBeenCalled();
    expect(dbMock.update).not.toHaveBeenCalled();
  });
  
  it("already_exists si existing accepted", async () => {
    // 1) targetUser
    dbMock.select.mockImplementationOnce(mockSelectLimit([{ id: "target" }]).select);
    // 2) myProfile
    dbMock.select.mockImplementationOnce(mockSelectLimit([{ userId: "me", role: "pair" }]).select);
    // 3) targetProfile
    dbMock.select.mockImplementationOnce(
      mockSelectLimit([{ userId: "target", role: "hero", isVisible: true }]).select
    );
  
    // 4) existing accepted
    dbMock.select.mockImplementationOnce(
      mockSelectOrderLimit([{ id: 3, fromUserId: "me", toUserId: "target", status: "accepted" }]).select
    );
  
    const res = await sendContactRequest("target");
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.field).toBe("already_exists");
  
    expect(dbMock.insert).not.toHaveBeenCalled();
    expect(dbMock.update).not.toHaveBeenCalled();
  });
});