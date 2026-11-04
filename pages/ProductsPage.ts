import { Page, Locator } from "@playwright/test";

export type SortOption = "az" | "za" | "lohi" | "hilo";

export class ProductsPage {
  readonly page: Page;
  readonly title: Locator;
  readonly inventoryItems: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  // Fixed products, so tests do not depend on the display order
  readonly addToCart_1: Locator; // Sauce Labs Backpack
  readonly addToCart_2: Locator; // Sauce Labs Bike Light
  readonly remove_1: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.menuButton = page.locator("#react-burger-menu-btn");
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');

    this.addToCart_1 = page.locator(
      '[data-test="add-to-cart-sauce-labs-backpack"]',
    );
    this.addToCart_2 = page.locator(
      '[data-test="add-to-cart-sauce-labs-bike-light"]',
    );
    this.remove_1 = page.locator('[data-test="remove-sauce-labs-backpack"]');
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }

  /** Select a sort option: az | za | lohi | hilo */
  async sortBy(option: SortOption) {
    await this.sortDropdown.selectOption(option);
  }

  async sortByPriceLowToHigh() {
    await this.sortBy("lohi");
  }

  /** Price text of the first product on the page, e.g. "$7.99" */
  async getFirstItemPrice(): Promise<string> {
    return (
      (await this.page
        .locator('[data-test="inventory-item-price"]')
        .first()
        .textContent()) ?? ""
    );
  }

  /** All displayed prices as numbers, in display order */
  async getAllPrices(): Promise<number[]> {
    const texts = await this.page
      .locator('[data-test="inventory-item-price"]')
      .allTextContents();
    return texts.map((t) => parseFloat(t.replace("$", "")));
  }

  /** All displayed product names, in display order */
  async getAllNames(): Promise<string[]> {
    return this.page
      .locator('[data-test="inventory-item-name"]')
      .allTextContents();
  }
}
