import { expect, type Page } from "@playwright/test";

export async function login(page: Page, baseURL: string, email: string, password: string) {
  await page.goto(`${baseURL}/auth/sign-in`);

  const emailInput =
    page.getByLabel(/email/i)
      .or(page.locator('input[type="email"]'))
      .or(page.getByPlaceholder(/email/i));

  await emailInput.first().fill(email);

  const passwordInput =
    page.getByLabel(/password|mot de passe/i)
      .or(page.locator('input[type="password"]'))
      .or(page.getByPlaceholder(/password|mot de passe/i));

  await passwordInput.first().fill(password);

  const submitBtn =
    page.getByRole("button", { name: /sign in|connexion|se connecter/i })
      .or(page.locator('button[type="submit"]'));

  await submitBtn.first().click();

  await expect(page).toHaveURL(/\/(matching|profile|requests)/);
}