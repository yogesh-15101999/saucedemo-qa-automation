// Test data shared across all UI tests (SauceDemo)

export const URL = 'https://www.saucedemo.com';

// ---------- Credentials ----------
export const STANDARD_USER = 'standard_user';
export const LOCKED_OUT_USER = 'locked_out_user';
export const PASSWORD = 'secret_sauce';
export const INVALID_USER = 'invalid_user';
export const INVALID_PASSWORD = 'wrong_password';

// ---------- Login messages ----------
export const LOCKED_OUT_ERROR = 'Epic sadface: Sorry, this user has been locked out.';
export const INVALID_CREDENTIALS_ERROR =
  'Epic sadface: Username and password do not match any user in this service';
export const USERNAME_REQUIRED_ERROR = 'Epic sadface: Username is required';
export const PASSWORD_REQUIRED_ERROR = 'Epic sadface: Password is required';
export const UNAUTHORIZED_ACCESS_ERROR =
  "Epic sadface: You can only access '/inventory.html' when you are logged in.";

// ---------- Checkout data ----------
export const CHECKOUT_FIRST_NAME = 'Smith';
export const CHECKOUT_LAST_NAME = 'Jones';
export const CHECKOUT_POSTAL_CODE = '600001';
export const CHECKOUT_SUCCESS_MESSAGE = 'Thank you for your order!';

// ---------- Checkout validation messages ----------
export const FIRST_NAME_REQUIRED_ERROR = 'Error: First Name is required';
export const LAST_NAME_REQUIRED_ERROR = 'Error: Last Name is required';
export const POSTAL_CODE_REQUIRED_ERROR = 'Error: Postal Code is required';

// ---------- Product names ----------
export const PRODUCT_BACKPACK = 'Sauce Labs Backpack';
export const PRODUCT_BIKE_LIGHT = 'Sauce Labs Bike Light';