import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { ProductsPage } from "../../pages/ProductsPage";
import * as sauceData from "../../test-data/saucedemo-data";

test.describe("Login", () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto(sauceData.URL);
  });

  // Scenario 1: A standard user can log in and land on the products page
  test("A standard user can log in and land on the products page", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await test.step("Login with standard user", async () => {
      await loginPage.login(sauceData.STANDARD_USER, sauceData.PASSWORD);
    });

    await test.step("Verify redirect to products page", async () => {
      await expect(page).toHaveURL(/.*inventory.html/);
      await expect(page.getByText("Products")).toBeVisible();
    });

    console.log(
      "✅ Case 1: Standard user logs in and lands on the products page - Passed",
    );
  });

  // Scenario 2: A locked-out user sees the correct error message and is NOT logged in
  test("A locked-out user sees the correct error message and is NOT logged in", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await test.step("Login with locked-out user", async () => {
      await loginPage.login(sauceData.LOCKED_OUT_USER, sauceData.PASSWORD);
    });

    await test.step("Verify error message is shown and there is no redirect", async () => {
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toHaveText(
        sauceData.LOCKED_OUT_ERROR,
      );
      await expect(page).not.toHaveURL(/.*inventory.html/);
    });

    console.log(
      "✅ Case 2: Locked-out user sees the correct error and is NOT logged in - Passed",
    );
  });

  // Extra 1: Valid username with a wrong password is rejected
  test("A user with a wrong password sees the invalid credentials error", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(sauceData.STANDARD_USER, sauceData.INVALID_PASSWORD);

    await expect(loginPage.errorMessage).toHaveText(
      sauceData.INVALID_CREDENTIALS_ERROR,
    );
    await expect(page).not.toHaveURL(/.*inventory.html/);

    console.log(
      "✅ Extra 1: Wrong password shows the invalid credentials error - Passed",
    );
  });

  // Extra 2: Unknown username is rejected
  test("A non-existent user sees the invalid credentials error", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(sauceData.INVALID_USER, sauceData.PASSWORD);

    await expect(loginPage.errorMessage).toHaveText(
      sauceData.INVALID_CREDENTIALS_ERROR,
    );

    console.log(
      "✅ Extra 2: Unknown user shows the invalid credentials error - Passed",
    );
  });

  // Extra 3: Username is mandatory
  test('Login with an empty username shows "Username is required"', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login("", sauceData.PASSWORD);

    await expect(loginPage.errorMessage).toHaveText(
      sauceData.USERNAME_REQUIRED_ERROR,
    );

    console.log("✅ Extra 3: Empty username validation - Passed");
  });

  // Extra 4: Password is mandatory
  test('Login with an empty password shows "Password is required"', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(sauceData.STANDARD_USER, "");

    await expect(loginPage.errorMessage).toHaveText(
      sauceData.PASSWORD_REQUIRED_ERROR,
    );

    console.log("✅ Extra 4: Empty password validation - Passed");
  });

  // Extra 5: The error banner can be dismissed
  test("The login error message can be dismissed", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(sauceData.LOCKED_OUT_USER, sauceData.PASSWORD);
    await expect(loginPage.errorMessage).toBeVisible();

    await loginPage.errorCloseButton.click();
    await expect(loginPage.errorMessage).toBeHidden();

    console.log("✅ Extra 5: Error message can be closed - Passed");
  });

  // Extra 6: Logging out returns the user to the login page
  test("A logged-in user can log out and return to the login page", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    await loginPage.login(sauceData.STANDARD_USER, sauceData.PASSWORD);
    await expect(page).toHaveURL(/.*inventory.html/);

    await productsPage.logout();

    await expect(page).toHaveURL(sauceData.URL + "/");
    await expect(loginPage.loginButton).toBeVisible();

    console.log(
      "✅ Extra 6: Logout returns the user to the login page - Passed",
    );
  });

  // Extra 7: Protected pages cannot be opened without logging in
  test("Opening the products page directly without login is blocked", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await page.goto(`${sauceData.URL}/inventory.html`);

    await expect(loginPage.errorMessage).toHaveText(
      sauceData.UNAUTHORIZED_ACCESS_ERROR,
    );
    await expect(page).not.toHaveURL(/.*inventory.html/);

    console.log(
      "✅ Extra 7: Direct URL access without login is blocked - Passed",
    );
  });
});
