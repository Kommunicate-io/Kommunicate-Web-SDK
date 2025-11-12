/*
 * richMessage_HTML_Content.spec.js
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

// Testing HTML Suggested Replies
test('HTML Suggested Replies', async () => {
    const iframe = page.frameLocator(WIDGET_LOCATORS.kmIframe);
    await iframe.locator(WIDGET_LOCATORS.kmTextBox).click();
    await iframe.locator(WIDGET_LOCATORS.kmTextBox).type('HTML Suggested Replies');
    await iframe.locator(WIDGET_LOCATORS.kmSendButton).click();
    await page.waitForTimeout(6000);

    const screenshot = await page.screenshot();
    expect(screenshot).toMatchSnapshot(
        {
            threshold: COMMON_VALUES.thresholdValue,
            name: 'HTML_Suggested_Replies.png',
        },
        './richMessage_Video_And_YouTube.spec.js-snapshots/'
    );
});

// Testing HTML Embed videos
test('HTML Embed videos', async () => {
    const iframe = page.frameLocator(WIDGET_LOCATORS.kmIframe);
    await iframe.locator(WIDGET_LOCATORS.kmTextBox).click();
    await iframe.locator(WIDGET_LOCATORS.kmTextBox).type('HTML Embed videos');
    await iframe.locator(WIDGET_LOCATORS.kmSendButton).click();
    await page.waitForTimeout(6000);

    const screenshot = await page.screenshot();
    expect(screenshot).toMatchSnapshot(
        {
            threshold: COMMON_VALUES.thresholdValue,
            name: 'HTML_Embed_videos.png',
        },
        './richMessage_Video_And_YouTube.spec.js-snapshots/'
    );
});

test.afterAll(async () => {
    await page.click(LOCATORS.logoutWidgetBtn);
});
