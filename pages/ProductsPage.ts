import { Page, Locator } from "@playwright/test";

export class ProductsPage {
    readonly page: Page;

    readonly addToCart_1: Locator;
    readonly addToCart_2: Locator;
    readonly cartBadge: Locator;


    constructor(page: Page) {
        this.page = page;

        this.addToCart_1 = page.getByTestId('add-to-cart-sauce-labs-backpack');
        this.addToCart_2 = page.getByTestId('add-to-cart-sauce-labs-bolt-t-shirt');
        this.cartBadge = page.getByTestId('shopping-cart-link');

    }
}