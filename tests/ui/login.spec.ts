import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import * as sauceData from '../../test-data/saucedemo-data';

test.describe('Login', () => {

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto(sauceData.URL);

    });

    //Scebario 1:  A standard user can log in and land on the products page

    test('A standard user can log in and land on the products page', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await test.step('login with standard user', async () => {
            await loginPage.login(sauceData.STANDARD_USER, sauceData.PASSWORD);
        });

        await test.step('Verify readirected to products page', async () => {
            await expect(page).toHaveURL(/.*inventory.html/);
            await expect(page.getByText('Products')).toBeVisible();
        });

        await page.waitForTimeout(3000);
    });


    // Scenario 2: A locked-out user sees the correct error message and is NOT logged in

    test('A locked-out user sees the correct error message and is NOT logged in', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await test.step('Login with locked out user', async () => {
            await loginPage.login(sauceData.LOCKED_OUT_USER, sauceData.PASSWORD);
        });

        await test.step('Verify error message shown and no redirection', async () => {
            await expect(loginPage.errorMessage).toBeVisible();
            await expect(loginPage.errorMessage).toHaveText(sauceData.LOCKED_OUT_ERROR);
            await expect(page).not.toHaveURL(/.*inventory.html/)

            await page.waitForTimeout(3000);

        });
    });


});