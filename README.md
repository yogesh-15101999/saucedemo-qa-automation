# SauceDemo QA Automation

![Playwright](https://img.shields.io/badge/Playwright-TypeScript-2EAD33?logo=playwright&logoColor=white)

UI and API test automation suite built with **Playwright + TypeScript** using the **Page Object Model**.

- UI target: [saucedemo.com](https://www.saucedemo.com)
- API target: [reqres.in](https://reqres.in)

## Tech stack

- Playwright Test (TypeScript)
- Page Object Model (POM)
- Centralised test data
- GitHub Actions CI with HTML report artifact

## Project structure

```
pages/        Page objects (LoginPage, ProductsPage, CartPage, CheckoutPage)
test-data/    Credentials, messages and API payloads
tests/ui/     UI specs (login, cart, checkout, sorting)
tests/api/    API specs (users)
playwright.config.ts
```

## Setup

```bash
npm install
npx playwright install
```

## Running the tests

```bash
npx playwright test                 # everything
npm run test:ui                     # UI only
npm run test:api                    # API only
npm run test:headed                 # UI with the browser visible
npm run report                      # open the last HTML report
```

### API key note

Reqres may require an API key. If API tests return 401/403, set your own key:

```bash
# macOS / Linux
REQRES_API_KEY=your_key npx playwright test --project=api

# Windows PowerShell
$env:REQRES_API_KEY="your_key"; npx playwright test --project=api
```

## Test coverage

32 automated tests: 26 UI and 6 API.

### Part 1: UI automation

| #   | Scenario                                                    | Status |
| --- | ----------------------------------------------------------- | ------ |
| 1   | Standard user logs in and lands on the products page        | ✅     |
| 2   | Locked-out user sees the correct error and is NOT logged in | ✅     |
| 3   | Adding two products updates the cart badge to 2             | ✅     |
| 4   | Full checkout flow shows "Thank you for your order!"        | ✅     |
| 5   | Price (low to high) shows the lowest price first            | ✅     |

### Part 2: API automation

| #   | Scenario                                                              | Status |
| --- | --------------------------------------------------------------------- | ------ |
| 6   | GET /api/users?page=2: status 200, `data` array, required user fields | ✅     |
| 7   | POST /api/users: status 201, echoed name/job, `id` and `createdAt`    | ✅     |
| 8   | Bonus: chained create-then-update flow using the returned id          | ✅     |

### Additional scenarios

- **Login:** wrong password, unknown user, empty username, empty password, dismiss error, logout, direct URL access without login
- **Cart:** empty cart has no badge, remove from products page, cart page contents, remove from cart page
- **Checkout:** missing first name, last name and postal code, cancel, total = item total + tax, cart cleared after order
- **Sorting:** full-list checks for price high to low, name A to Z, name Z to A
- **API:** GET single user, 404 for unknown user, DELETE user

## Notes

- Reqres does not persist data, so the bonus scenario chains POST with a PUT that reuses the returned `id`.
- Sorting tests assert the whole list order instead of only the first item, so they do not break if prices change.
