import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProductsPage } from '../../pages/ProductsPage';
import * as sauceData from '../../test-data/saucedemo-data';

test.describe('Cart', () => {

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto(sauceData.URL);
        await loginPage.login(sauceData.STANDARD_USER, sauceData.PASSWORD);
        await expect(page).toHaveURL(/.*inventory.html/);
        await expect(page.getByText('Products')).toBeVisible();

    });

    // Scenario 3: After logging in, add any two products to the cart and verify the cart badge updates to 2.

    test('After logging in, add any two products to the cart and verify the cart badge updates to 2', async ({ page }) => {
        const productsPage = new ProductsPage(page);

        await test.step('Add first product, badge should show 1', async () => {
            await productsPage.addToCart_1.click();
            await expect(productsPage.cartBadge).toHaveText('1');
            // await page.waitForTimeout(3000);

        });

        await test.step('Add second product, badge should show 2', async () => {
            await productsPage.addToCart_2.click();
            await expect(productsPage.cartBadge).toHaveText('2');
            // await page.waitForTimeout(3000);

        });
        console.log('✅ Case 3: After logging in, add any two products to the cart and verify the cart badge updates to 2✅');

    });
});