// playwright.config.js
// @ts-check
const { devices } = require('@playwright/test');

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
    // Test directory
    testDir: './tests',
    // Options shared for all projects.
    timeout: 30000,
    reporter: 'html',
    use: {
        ignoreHTTPSErrors: true,
        headless: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'on',
    },

    // Options specific to each project.
    projects: [
        {
            name: 'Desktop Chromium',
            use: {
                browserName: 'chromium',
                viewport: { width: 1280, height: 720 },
                permissions: ['geolocation'],
            },
        },
        {
            name: 'Desktop Safari',
            use: {
                browserName: 'webkit',
                viewport: { width: 1280, height: 720 },
                permissions: ['geolocation'],
            },
        },
        {
            name: 'Desktop Firefox',
            use: {
                browserName: 'firefox',
                viewport: { width: 1280, height: 720 },
                permissions: ['geolocation'],
            },
        },
    ],
};

module.exports = config;
