This Project is created in [Playwright](https://playwright.dev/)

## Contents:

-   [Install PlayWright](#installing-playwright)
-   [Folder Structure](#folder-structure)
-   [How to run this test in local](#how-to-run-this-test-in-local)

## Installing Playwright

Get started by installing Playwright using npm.

```js
npm init playwright@latest
```

Run the install command and select the following to get started:

-   Choose between TypeScript or JavaScript (we are using JavaScript)
-   Name of your Tests folder (default is tests or e2e if you already have a tests folder in your project)

## Folder Structure

Playwright will download the browsers needed as well as create the following files.

```js
playwright.config.js;
package.json;
package - lock.json;
tests / example.spec.js;
tests - examples / demo - todo - app.spec.js;
```

The [playwright.config](https://playwright.dev/docs/test-configuration) is where you can add configuration for Playwright including modifying which browsers you would like to run Playwright on. If you are running tests inside an already existing project then dependencies will be added directly to your `package.json`.

The `tests` folder contains a basic example test to help you get started with testing. For a more detailed example check out the `tests-examples` folder which contains tests written to test a todo app.

## How to run this test in local

Clone the repo in your local.

Step 1: Navigate to playwright_test folder and run below command to Install Playwright Browsers and dependencies(if the browsers are already install you can skip this step)

```js
npx playwright install --with-deps
```

Step2: Run below command to Install the package to use Playwright Test , it will create a node_module folder in the directory

```js
npm install @playwright/test
```

Step3: Run below command to run the test cases

```js
npx playwright test
```

Step4: Run below command to show the test report

```js
npx playwright show-report
```
