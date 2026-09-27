import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProductsPage } from '../../pages/ProductsPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import * as sauceData from '../../test-data/saucedemo-data';

test.describe('Checkout', () => {

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto(sauceData.URL);
        await loginPage.login(sauceData.STANDARD_USER, sauceData.PASSWORD);
        await expect(page).toHaveURL(/.*inventory.html/);
        await expect(page.getByText('Products')).toBeVisible();
    });

    // Scenario 4: Complete the full checkout flow with the items in the cart.

    test('Complete the full checkout flow with the items in the cart', async ({ page }) => {
        const productsPage = new ProductsPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('add a product to cart', async () => {
            await productsPage.addToCart_1.click();
        });

        await test.step('go to cart and start checkout', async () => {
            await productsPage.goToCart();
            await checkoutPage.checkoutButton.click();
        });

        await test.step('fill checkout info and continue', async () => {
            await checkoutPage.fillCheckoutInfo(
                sauceData.CHECKOUT_FIRST_NAME,
                sauceData.CHECKOUT_LAST_NAME,
                sauceData.CHECKOUT_POSTAL_CODE
            );
            // await page.waitForTimeout(3000);

            await checkoutPage.continueButton.click();
        });

        await test.step('finish order', async () => {
            await checkoutPage.finishButton.click();
        });

        await test.step('verify order confirmation', async () => {
            await expect(checkoutPage.completeHeader).toBeVisible();
            await expect(checkoutPage.completeHeader).toHaveText(sauceData.CHECKOUT_SUCCESS_MESSAGE);
            // await page.waitForTimeout(3000);

        });
        console.log('✅ Case 4: Complete the full checkout flow with the items in the cart - Passed✅');

    });

});