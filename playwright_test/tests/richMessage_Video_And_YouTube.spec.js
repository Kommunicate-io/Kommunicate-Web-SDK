/*
 * richMessage_Video_And_YouTube.spec.js
 * playwright_test/test
 * Created by Archit on 22/01/2023.
 */

import { test, expect } from '@playwright/test';
import { WIDGET_LOCATORS, LOCATORS, COMMON_VALUES } from '../locaterPackage/kmLocators.js';
import { URL, APP_ID } from '../utils/kmSecret';
import { SCRIPT } from '../utils/kmScript';

let page;

// Launching widget
test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(URL.kmWidgetURL);
    await page.waitForSelector(LOCATORS.envBtn);
    await page.click(LOCATORS.envBtn);
    await page.click(LOCATORS.appIdField);
    await page.keyboard.press('Meta+A');
    await page.type(LOCATORS.appIdField, APP_ID.kmAppId);
    await page.click(LOCATORS.scriptFiled);
    await page.keyboard.press('Meta+A');
    await page.keyboard.press('Delete');
    await page.type(LOCATORS.scriptFiled, SCRIPT.kmSendMessageScript);
    await page.click(LOCATORS.launchWidgetBtn);
    await page
        .frameLocator(WIDGET_LOCATORS.kmIframe)
        .locator(WIDGET_LOCATORS.kmLaunchWidget)
        .click();
});

// Testing Video and Youtube
test('Video and Youtube', async () => {
    const iframe = page.frameLocator(WIDGET_LOCATORS.kmIframe);
    await iframe.locator(WIDGET_LOCATORS.kmTextBox).click();
    await iframe.locator(WIDGET_LOCATORS.kmTextBox).type('Video and Youtube');
    await iframe.locator(WIDGET_LOCATORS.kmSendButton).click();
    await page.waitForTimeout(6000);

    const screenshot = await page.screenshot();
    expect(screenshot).toMatchSnapshot(
        {
            threshold: COMMON_VALUES.thresholdValue,
            name: 'Video&YouTube.png',
        },
        './richMessage_Video_And_YouTube.spec.js-snapshots/'
    );
});

test.afterAll(async () => {
    await page.click(LOCATORS.logoutWidgetBtn);
});
