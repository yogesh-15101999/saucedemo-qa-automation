import { Page, Locator } from "@playwright/test";

export class CheckoutPage {
  readonly page: Page;

  // Cart / step one
  readonly checkoutButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  // Step two (overview)
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;

  // Complete
  readonly completeHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');

    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');

    this.completeHeader = page.locator('[data-test="complete-header"]');
  }

  /** Fill the customer information form (does not click Continue). Empty strings are allowed. */
  async fillCheckoutInfo(
    firstName: string,
    lastName: string,
    postalCode: string,
  ) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  /** Extract the number from labels like "Item total: $29.99" or "Tax: $2.40" */
  private async amountFrom(label: Locator): Promise<number> {
    const text = (await label.textContent()) ?? "";
    return parseFloat(text.replace(/[^0-9.]/g, ""));
  }

  async getSubtotal(): Promise<number> {
    return this.amountFrom(this.subtotalLabel);
  }

  async getTax(): Promise<number> {
    return this.amountFrom(this.taxLabel);
  }

  async getTotal(): Promise<number> {
    return this.amountFrom(this.totalLabel);
  }
}
