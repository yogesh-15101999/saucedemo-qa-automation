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
4. Complete the full checkout flow with the items in the cart (fill checkout info, finish the order, verify the "Thank you for your order" message). ✅
5. Sort products by "Price (low to high)" and verify the first product displayed has the lowest price. ✅


## Part 2 - API Automatiom

6. GET /api/users?page=2 — verify status 200, that the response includes a "data" array, and that each user object contains id, email, first_name, last_name. ❌
7. POST /api/users with a JSON body { "name": "morpheus", "job": "leader" } — verify status 201 and that the response echoes back the name and job along with an id and createdAt timestamp. ❌
8. Bonus (only if time permits): chain the POST with a follow-up assertion. No need to actually GET the created user — reqres does not persist data — just demonstrate how you would structure a create-then-verify flow. ❌

## UI Automation tests completed

## API Automation tests — not completed within the time-box