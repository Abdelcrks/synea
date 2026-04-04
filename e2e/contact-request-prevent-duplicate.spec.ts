  import { test, expect } from "@playwright/test";
  import { resetContactRequests } from "./helpers/db";

  test.beforeEach(async () => {
    await resetContactRequests(
      process.env.E2E_USER_A_ID!,
      process.env.E2E_USER_B_ID!
    );
  });

  test("cannot send duplicate contact request when pending", async ({ browser }) => {
    const userBId = process.env.E2E_USER_B_ID!;

    const ctxA = await browser.newContext({ storageState: "e2e/.auth/userA.json" });
    const pageA = await ctxA.newPage();

    await pageA.goto("/matching");

    // Cible la card de userB spécifiquement
    const cardB = pageA.getByTestId(`profile-card-${userBId}`);
    await expect(cardB).toBeVisible();
    const sendBtn = cardB.getByTestId("send-request");

    await sendBtn.click();
    await expect(cardB.getByTestId("request-feedback")).toBeVisible();

    await expect(sendBtn).toBeDisabled();
    await expect(sendBtn).toHaveText(/en attente/i);

    await ctxA.close();
  });