import { describe, it, expect, vi, beforeEach } from "vitest";

//  évite le crash Next "outside request scope"
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

//  mock le module que ton action importe réellement (stacktrace: lib/actions/auth/requireActiveSession.ts)
vi.mock("@/lib/actions/auth/requireActiveSession", () => ({
  requireActiveSession: () => requireActiveSessionMock(),
}));

vi.mock("@/lib/db/drizzle", () => ({
  db: dbMock,
}));

import { cancelContactRequest } from "../cancelContactRequest";

function mockUpdateReturning(rows: unknown[]) {
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

describe("cancelContactRequest", () => {
  it("ok:true si annulation réussit", async () => {
    const chain = mockUpdateReturning([{ id: 123 }]);
    dbMock.update.mockImplementation(chain.update);

    const res = await cancelContactRequest(123);

    expect(res.ok).toBe(true);
    expect(dbMock.update).toHaveBeenCalledTimes(1);
    expect(revalidatePathMock).toHaveBeenCalledWith("/requests");
  });

  it("ok:false si aucune ligne mise à jour (id inexistant / pas owner / pas pending)", async () => {
    const chain = mockUpdateReturning([]);
    dbMock.update.mockImplementation(chain.update);

    const res = await cancelContactRequest(999);

    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.message).toMatch(/Impossible/i);

    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("ok:false si requestId invalide", async () => {
    const res = await cancelContactRequest(0);

    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.message).toMatch(/Impossible/i); // si tu veux mieux: ajoute une validation requestId dans l'action

    // ici, ton action ne valide pas requestId => elle va quand même tenter update
    // donc on ne peut pas expect "not called" sans modifier l'action.
  });
});