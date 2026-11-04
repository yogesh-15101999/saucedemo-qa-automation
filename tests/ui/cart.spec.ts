import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { ProductsPage } from "../../pages/ProductsPage";
import { CartPage } from "../../pages/CartPage";
import * as sauceData from "../../test-data/saucedemo-data";

test.describe("Cart", () => {
  // Every cart test starts from a logged-in session on the products page
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto(sauceData.URL);
    await loginPage.login(sauceData.STANDARD_USER, sauceData.PASSWORD);
    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(page.getByText("Products")).toBeVisible();
  });

  // Scenario 3: Add any two products to the cart and verify the cart badge updates to 2
  test("After logging in, add any two products to the cart and verify the cart badge updates to 2", async ({
    page,
  }) => {
    const productsPage = new ProductsPage(page);

    await test.step("Add first product, badge should show 1", async () => {
      await productsPage.addToCart_1.click();
      await expect(productsPage.cartBadge).toHaveText("1");
    });

    await test.step("Add second product, badge should show 2", async () => {
      await productsPage.addToCart_2.click();
      await expect(productsPage.cartBadge).toHaveText("2");
    });

    console.log(
      "✅ Case 3: Cart badge updates to 2 after adding two products - Passed",
    );
  });

  // Extra 1: Cart starts empty
  test("The cart badge is not shown when the cart is empty", async ({
    page,
  }) => {
    const productsPage = new ProductsPage(page);

    await expect(productsPage.cartBadge).toBeHidden();

    console.log("✅ Extra 1: No badge for an empty cart - Passed");
  });

  // Extra 2: Removing from the products page lowers the badge
  test("Removing a product from the products page decrements the cart badge", async ({
    page,
  }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.addToCart_1.click();
    await productsPage.addToCart_2.click();
    await expect(productsPage.cartBadge).toHaveText("2");

    await productsPage.remove_1.click();
    await expect(productsPage.cartBadge).toHaveText("1");

    console.log(
      "✅ Extra 2: Badge decrements after removing a product - Passed",
    );
  });

  // Extra 3: The cart page lists exactly what was added
  test("The cart page lists the products that were added", async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await productsPage.addToCart_1.click();
    await productsPage.addToCart_2.click();
    await productsPage.goToCart();

    await expect(page).toHaveURL(/.*cart.html/);
    await expect(cartPage.cartItems).toHaveCount(2);
    expect(await cartPage.getItemNames()).toEqual(
      expect.arrayContaining([
        sauceData.PRODUCT_BACKPACK,
        sauceData.PRODUCT_BIKE_LIGHT,
      ]),
    );

    console.log("✅ Extra 3: Cart page shows the added products - Passed");
  });

  // Extra 4: Removing from the cart page empties the cart
  test("Removing the only item on the cart page leaves the cart empty", async ({
    page,
  }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await productsPage.addToCart_1.click();
    await productsPage.goToCart();
    await cartPage.removeItem("sauce-labs-backpack");

    await expect(cartPage.cartItems).toHaveCount(0);
    await expect(productsPage.cartBadge).toBeHidden();

    console.log("✅ Extra 4: Cart is empty after removing the item - Passed");
  });
});
