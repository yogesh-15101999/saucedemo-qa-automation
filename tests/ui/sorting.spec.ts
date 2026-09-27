import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProductsPage } from '../../pages/ProductsPage';
import * as sauceData from '../../test-data/saucedemo-data';

test.describe('Sorting', () => {

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto(sauceData.URL);
        await loginPage.login(sauceData.STANDARD_USER, sauceData.PASSWORD);
        await expect(page).toHaveURL(/.*inventory.html/);
        await expect(page.getByText('Products')).toBeVisible();
    });

    // Scenario 5: Sort products by "Price (low to high)" and verify the first product displayed has the lowest price

    test('Sort products by "Price (low to high)" and verify the first product displayed has the lowest price', async ({ page }) => {
        const productsPage = new ProductsPage(page);

        await test.step('apply sort', async () => {
            await productsPage.sortByPriceLowToHigh();
        });

        await test.step('verify first item is the cheapest ($7.99 - Sauce Labs Onesie)', async () => {
            const firstItemPrice = await productsPage.getFirstItemPrice();
            expect(firstItemPrice).toBe('$7.99');
        });

        // await page.waitForTimeout(3000);

        console.log('✅ Case 5: Sort products by "Price (low to high)" and verify the first product displayed has the lowest price - Passed✅');

    });

});