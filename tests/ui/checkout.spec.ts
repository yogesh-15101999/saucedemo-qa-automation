import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { ProductsPage } from "../../pages/ProductsPage";
import { CheckoutPage } from "../../pages/CheckoutPage";
import * as sauceData from "../../test-data/saucedemo-data";

test.describe("Checkout", () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto(sauceData.URL);
    await loginPage.login(sauceData.STANDARD_USER, sauceData.PASSWORD);
    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(page.getByText("Products")).toBeVisible();
  });

  /**
   * Helper: add a product, open the cart and land on the
   * "Checkout: Your Information" form.
   */
  async function startCheckout(page: import("@playwright/test").Page) {
    const productsPage = new ProductsPage(page);
    const checkoutPage = new CheckoutPage(page);

    await productsPage.addToCart_1.click();
    await productsPage.goToCart();
    await checkoutPage.checkoutButton.click();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);
  }

  // Scenario 4: Complete the full checkout flow with the items in the cart
  test("Complete the full checkout flow with the items in the cart", async ({
    page,
  }) => {
    const productsPage = new ProductsPage(page);
    const checkoutPage = new CheckoutPage(page);

    await test.step("Add a product to the cart", async () => {
      await productsPage.addToCart_1.click();
    });

    await test.step("Go to cart and start checkout", async () => {
      await productsPage.goToCart();
      await checkoutPage.checkoutButton.click();
    });

    await test.step("Fill checkout information and continue", async () => {
      await checkoutPage.fillCheckoutInfo(
        sauceData.CHECKOUT_FIRST_NAME,
        sauceData.CHECKOUT_LAST_NAME,
        sauceData.CHECKOUT_POSTAL_CODE,
      );
      await checkoutPage.continueButton.click();
    });

    await test.step("Finish the order", async () => {
      await checkoutPage.finishButton.click();
    });

    await test.step("Verify the order confirmation", async () => {
      await expect(checkoutPage.completeHeader).toBeVisible();
      await expect(checkoutPage.completeHeader).toHaveText(
        sauceData.CHECKOUT_SUCCESS_MESSAGE,
      );
    });

    console.log("✅ Case 4: Full checkout flow completed - Passed");
  });

  // Extra 1: First name is mandatory
  test("Checkout without a first name shows a validation error", async ({
    page,
  }) => {
    const checkoutPage = new CheckoutPage(page);
    await startCheckout(page);

    await checkoutPage.fillCheckoutInfo(
      "",
      sauceData.CHECKOUT_LAST_NAME,
      sauceData.CHECKOUT_POSTAL_CODE,
    );
    await checkoutPage.continueButton.click();

    await expect(checkoutPage.errorMessage).toHaveText(
      sauceData.FIRST_NAME_REQUIRED_ERROR,
    );

    console.log("✅ Extra 1: First name validation - Passed");
  });

  // Extra 2: Last name is mandatory
  test("Checkout without a last name shows a validation error", async ({
    page,
  }) => {
    const checkoutPage = new CheckoutPage(page);
    await startCheckout(page);

    await checkoutPage.fillCheckoutInfo(
      sauceData.CHECKOUT_FIRST_NAME,
      "",
      sauceData.CHECKOUT_POSTAL_CODE,
    );
    await checkoutPage.continueButton.click();

    await expect(checkoutPage.errorMessage).toHaveText(
      sauceData.LAST_NAME_REQUIRED_ERROR,
    );

    console.log("✅ Extra 2: Last name validation - Passed");
  });

  // Extra 3: Postal code is mandatory
  test("Checkout without a postal code shows a validation error", async ({
    page,
  }) => {
    const checkoutPage = new CheckoutPage(page);
    await startCheckout(page);

    await checkoutPage.fillCheckoutInfo(
      sauceData.CHECKOUT_FIRST_NAME,
      sauceData.CHECKOUT_LAST_NAME,
      "",
    );
    await checkoutPage.continueButton.click();

    await expect(checkoutPage.errorMessage).toHaveText(
      sauceData.POSTAL_CODE_REQUIRED_ERROR,
    );

    console.log("✅ Extra 3: Postal code validation - Passed");
  });

  // Extra 4: Cancel on the information form returns to the cart
  test("Cancelling checkout returns the user to the cart", async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    await startCheckout(page);

    await checkoutPage.cancelButton.click();

    await expect(page).toHaveURL(/.*cart.html/);

    console.log("✅ Extra 4: Cancel returns to the cart - Passed");
  });

  // Extra 5: The overview page total = item total + tax
  test("The order overview total equals item total plus tax", async ({
    page,
  }) => {
    const productsPage = new ProductsPage(page);
    const checkoutPage = new CheckoutPage(page);
    await startCheckout(page);

    await checkoutPage.fillCheckoutInfo(
      sauceData.CHECKOUT_FIRST_NAME,
      sauceData.CHECKOUT_LAST_NAME,
      sauceData.CHECKOUT_POSTAL_CODE,
    );
    await checkoutPage.continueButton.click();
    await expect(page).toHaveURL(/.*checkout-step-two.html/);

    const subtotal = await checkoutPage.getSubtotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();

    // toBeCloseTo avoids floating-point rounding noise
    expect(total).toBeCloseTo(subtotal + tax, 2);
    console.log(`   Subtotal: ${subtotal} | Tax: ${tax} | Total: ${total}`);

    console.log("✅ Extra 5: Order total calculation is correct - Passed");
  });

  // Extra 6: Cart badge is cleared after a completed order
  test("The cart is emptied after the order is completed", async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const checkoutPage = new CheckoutPage(page);
    await startCheckout(page);

    await checkoutPage.fillCheckoutInfo(
      sauceData.CHECKOUT_FIRST_NAME,
      sauceData.CHECKOUT_LAST_NAME,
      sauceData.CHECKOUT_POSTAL_CODE,
    );
    await checkoutPage.continueButton.click();
    await checkoutPage.finishButton.click();

    await expect(checkoutPage.completeHeader).toBeVisible();
    await expect(productsPage.cartBadge).toBeHidden();

    console.log("✅ Extra 6: Cart is cleared after the order - Passed");
  });
});
