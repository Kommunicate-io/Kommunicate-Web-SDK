/*
 * LaunchWidgetAndSendMessage.spec.js
 * playwright_test/test
 * Created by Archit on 20/12/2022.
 */

import { test, expect } from '@playwright/test';
import { WIDGET_LOCATORS, LOCATORS } from '../locaterPackage/kmLocators';
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

// Testing chat creation and message sending
test('send message', async () => {
    const iframe = page.frameLocator(WIDGET_LOCATORS.kmIframe);
    await iframe.locator(WIDGET_LOCATORS.kmTextBox).click();
    await iframe.locator(WIDGET_LOCATORS.kmTextBox).type('hello');
    await iframe.locator(WIDGET_LOCATORS.kmSendButton).click();
    await page.waitForTimeout(3000);

    // The message status verify that the message was successfully sent
    const isVisible = await iframe.locator(WIDGET_LOCATORS.kmMsgStatus).isVisible();
    expect(isVisible).toBe(true);
});

test.afterAll(async () => {
    await page.click(LOCATORS.logoutWidgetBtn);
});
