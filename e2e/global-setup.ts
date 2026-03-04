import { chromium } from "@playwright/test";
import { login } from "./helpers/auth";
import fs from "node:fs";

export default async function globalSetup() {
  const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

  const emailA = process.env.E2E_USER_A_EMAIL!;
  const passA = process.env.E2E_USER_A_PASSWORD!;
  const emailB = process.env.E2E_USER_B_EMAIL!;
  const passB = process.env.E2E_USER_B_PASSWORD!;

  if (!emailA || !passA || !emailB || !passB) {
    throw new Error("Missing E2E env vars: E2E_USER_A_EMAIL/PASSWORD and E2E_USER_B_EMAIL/PASSWORD");
  }

  fs.mkdirSync("e2e/.auth", { recursive: true });

  const browser = await chromium.launch();

  // User A
  {
    const page = await (await browser.newContext()).newPage();
    await page.goto(baseURL);
    await login(page,baseURL, emailA, passA);
    await page.context().storageState({ path: "e2e/.auth/userA.json" });
    await page.close();
  }

  // User B
  {
    const page = await (await browser.newContext()).newPage();
    await page.goto(baseURL);
    await login(page,baseURL, emailB, passB);
    await page.context().storageState({ path: "e2e/.auth/userB.json" });
    await page.close();
  }

  await browser.close();
}