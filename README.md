# Saucedemo QA Automation Assignment

playwright(TypeScript) UI test suite for saucedemo.com

## Setup

npm install
npx playwright install

## Running the tests

npx playwright test

## Write tests that cover the following scenarios:
## Part 1 — UI Automation

1. A standard user can log in and land on the products page. ✅
2. A locked-out user sees the correct error message and is NOT logged in. ✅
3. After logging in, add any two products to the cart and verify the cart badge updates to 2. ✅
4. Complete the full checkout flow with the items in the cart (fill checkout info, finish the order, verify the "Thank you for your order" message).
5. Sort products by "Price (low to high)" and verify the first product displayed has the lowest price.