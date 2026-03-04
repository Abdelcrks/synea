import { test, expect } from "@playwright/test";

import { resetContactRequests } from "./helpers/db";

test.beforeEach(async () => {
  await resetContactRequests(
    process.env.E2E_USER_A_ID!,
    process.env.E2E_USER_B_ID!
  );
});

test("send contact request then accept it", async ({ browser }) => {
  const userBId = process.env.E2E_USER_B_ID!;

  // --- User A: envoie la demande ---
  const ctxA = await browser.newContext({ storageState: "e2e/.auth/userA.json" });
  const pageA = await ctxA.newPage();

  await pageA.goto("/matching");

  const cardB = pageA.getByTestId(`profile-card-${userBId}`);
  await expect(cardB).toBeVisible();
  await cardB.getByTestId("send-request").click();
  await expect(cardB.getByTestId("request-feedback")).toBeVisible();
  await ctxA.close();

  // --- User B: accepte la demande ---
  const ctxB = await browser.newContext({ storageState: "e2e/.auth/userB.json" });
  const pageB = await ctxB.newPage();

  await pageB.goto("/requests");
  await expect(pageB.getByTestId("accept-request")).toBeVisible();
  await pageB.getByTestId("accept-request").click();
  // ✅ la card disparaît après acceptation → plus de bouton accept
  await expect(pageB.getByTestId("accept-request")).not.toBeVisible();
  await ctxB.close();
});