import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { ProductsPage } from "../../pages/ProductsPage";
import * as sauceData from "../../test-data/saucedemo-data";

test.describe("Sorting", () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto(sauceData.URL);
    await loginPage.login(sauceData.STANDARD_USER, sauceData.PASSWORD);
    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(page.getByText("Products")).toBeVisible();
  });

  // Scenario 5: Sort by "Price (low to high)" and verify the first product has the lowest price
  test('Sort products by "Price (low to high)" and verify the first product displayed has the lowest price', async ({
    page,
  }) => {
    const productsPage = new ProductsPage(page);

    await test.step("Apply the sort", async () => {
      await productsPage.sortByPriceLowToHigh();
    });

    await test.step("Verify the first item is the cheapest ($7.99 - Sauce Labs Onesie)", async () => {
      const firstItemPrice = await productsPage.getFirstItemPrice();
      expect(firstItemPrice).toBe("$7.99");
    });

    await test.step("Verify the first price is the minimum of all prices", async () => {
      const prices = await productsPage.getAllPrices();
      expect(prices[0]).toBe(Math.min(...prices));
    });

    console.log(
      "✅ Case 5: Price (low to high) shows the cheapest product first - Passed",
    );
  });

  // Extra 1: The whole list, not just the first item, is in ascending order
  test("Price (low to high) orders the entire list ascending", async ({
    page,
  }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.sortBy("lohi");

    const prices = await productsPage.getAllPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));

    console.log("✅ Extra 1: Full list sorted by price ascending - Passed");
  });

  // Extra 2: Price high to low
  test("Price (high to low) orders the entire list descending", async ({
    page,
  }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.sortBy("hilo");

    const prices = await productsPage.getAllPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
    expect(await productsPage.getFirstItemPrice()).toBe("$49.99");

    console.log("✅ Extra 2: Full list sorted by price descending - Passed");
  });

  // Extra 3: Name A to Z
  test("Name (A to Z) orders the entire list alphabetically", async ({
    page,
  }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.sortBy("az");

    const names = await productsPage.getAllNames();
    expect(names).toEqual([...names].sort());

    console.log("✅ Extra 3: Full list sorted A to Z - Passed");
  });

  // Extra 4: Name Z to A
  test("Name (Z to A) orders the entire list in reverse alphabetical order", async ({
    page,
  }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.sortBy("za");

    const names = await productsPage.getAllNames();
    expect(names).toEqual([...names].sort().reverse());

    console.log("✅ Extra 4: Full list sorted Z to A - Passed");
  });
});
