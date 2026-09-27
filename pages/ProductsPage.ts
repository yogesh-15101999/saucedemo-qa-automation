import { Page, Locator } from "@playwright/test";

export class ProductsPage {
    readonly page: Page;

    readonly addToCart_1: Locator;
    readonly addToCart_2: Locator;
    readonly cartBadge: Locator;
    readonly cartIcon: Locator;

    readonly sortDropdown: Locator;
    readonly itemPrice: Locator;

    constructor(page: Page) {
        this.page = page;

        this.addToCart_1 = page.getByTestId('add-to-cart-sauce-labs-backpack');
        this.addToCart_2 = page.getByTestId('add-to-cart-sauce-labs-bolt-t-shirt');

        this.cartBadge = page.getByTestId('shopping-cart-badge');
        this.cartIcon = page.getByTestId('shopping-cart-link');

        this.sortDropdown = page.getByTestId('product-sort-container');
        this.itemPrice = page.locator('.inventory_item_price');
    }

    async sortByPriceLowToHigh() {
        await this.sortDropdown.selectOption('lohi');
    }

    async getFirstItemPrice() {
        return await this.itemPrice.first().textContent();
    }

    async goToCart() {
        await this.cartIcon.click();
    }
}