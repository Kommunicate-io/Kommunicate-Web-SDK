/*
 * Quick_Replies.spec.js
 * playwright_test/test
 * Created by Archit on 01/02/2023.
 */

import { test, expect } from '@playwright/test';
import { WIDGET_LOCATORS, LOCATORS, COMMON_VALUES } from '../locaterPackage/kmLocators';
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
    await page.type(LOCATORS.scriptFiled, SCRIPT.kmQuickReplies);
    await page.click(LOCATORS.launchWidgetBtn);
    await page
        .frameLocator(WIDGET_LOCATORS.kmIframe)
        .locator(WIDGET_LOCATORS.kmLaunchWidget)
        .click();
});

// Testing Quick Replies
test('Quick Replies', async () => {
    const iframe = page.frameLocator(WIDGET_LOCATORS.kmIframe);
    await iframe.locator(WIDGET_LOCATORS.kmQuickRepliesBtn).click();

    // The UI of Quick Replies button check using snapshot
    const screenshot = await page.screenshot();
    expect(screenshot).toMatchSnapshot(
        {
            threshold: COMMON_VALUES.thresholdValue,
            name: 'Quick Replies.png',
        },
        './Quick_Replies.spec.js-snapshots/'
    );

    // Checking click action on Quick Replies
    await iframe.locator(WIDGET_LOCATORS.kmQuickReplyOptions).click();
    await page.waitForTimeout(2000);
    const isVisible = await iframe.locator(WIDGET_LOCATORS.kmMsgStatus).isVisible();
    expect(isVisible).toBe(true);
});

test.afterAll(async () => {
    await page.click(LOCATORS.logoutWidgetBtn);
});
