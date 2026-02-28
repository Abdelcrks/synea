import { describe, it, expect, vi, beforeEach } from "vitest";

// évite le crash Next "outside request scope"
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
      update: vi.fn(),
    },
  };
});

vi.mock("next/cache", () => ({
  revalidatePath: (path: string) => revalidatePathMock(path),
}));

//  mock le même module que ton action importe
vi.mock("@/lib/actions/auth/requireActiveSession", () => ({
  requireActiveSession: () => requireActiveSessionMock(),
}));

vi.mock("@/lib/db/drizzle", () => ({
  db: dbMock,
}));

import { acceptContactRequest } from "../acceptContactRequest";

function mockUpdateReturning(rows: any[]) {
  const returning = vi.fn().mockResolvedValue(rows);
  const where = vi.fn(() => ({ returning }));
  const set = vi.fn(() => ({ where }));
  const update = vi.fn(() => ({ set }));
  return { update, set, where, returning };
}

beforeEach(() => {
  vi.clearAllMocks();
  requireActiveSessionMock.mockResolvedValue({ user: { id: "me" } });
});

describe("acceptContactRequest", () => {
  it("ok:true si update réussit", async () => {
    const chain = mockUpdateReturning([{ id: 123 }]);
    dbMock.update.mockImplementation(chain.update);

    const res = await acceptContactRequest(123);

    expect(res.ok).toBe(true);
    expect(dbMock.update).toHaveBeenCalledTimes(1);
    expect(revalidatePathMock).toHaveBeenCalledWith("/requests");
  });

  it("ok:false si aucune ligne mise à jour (id inexistant / pas owner / pas pending)", async () => {
    const chain = mockUpdateReturning([]);
    dbMock.update.mockImplementation(chain.update);

    const res = await acceptContactRequest(999);

    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.message).toMatch(/Impossible/i);
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("ok:false si requestId invalide", async () => {
    const res = await acceptContactRequest(0);

    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.message).toMatch(/invalide/i);
    expect(dbMock.update).not.toHaveBeenCalled();
  });
});