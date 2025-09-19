/*
 * chatOptions.spec.js
 * playwright_test/tests
 * Created by Archit on 23/12/2022.
 */

import { test, expect } from '@playwright/test';
import { WIDGET_LOCATORS, LOCATORS } from '../locaterPackage/kmLocators';
import { URL, APP_ID } from '../utils/kmSecret';
import { SCRIPT } from '../utils/kmScript';

let page;

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
    await page.type(LOCATORS.scriptFiled, SCRIPT.kmAllBooleanIsTrue);
    await page.click(LOCATORS.launchWidgetBtn);
    await page
        .frameLocator(WIDGET_LOCATORS.kmIframe)
        .locator(WIDGET_LOCATORS.kmLaunchWidget)
        .click();
});

test('Send Emoji', async () => {
    const iframe = page.frameLocator(WIDGET_LOCATORS.kmIframe);
    await iframe.locator(WIDGET_LOCATORS.kmEmojiBtn).click();
    await iframe.locator(WIDGET_LOCATORS.kmSmirkEmoji).click();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(3000);

    // The message status verify that the message was successfully sent
    const isVisible = await iframe.locator(WIDGET_LOCATORS.kmMsgStatus).isVisible();
    expect(isVisible).toBe(true);
});

test('Send Location', async () => {
    const iframe = page.frameLocator(WIDGET_LOCATORS.kmIframe);
    await iframe.locator(WIDGET_LOCATORS.kmLocBtn).click();
    await iframe.locator(WIDGET_LOCATORS.kmLocSendBtn).click();
    await page.waitForTimeout(3000);

    // The message status verify that the message was successfully sent
    await page.locator(WIDGET_LOCATORS.kmMsgStatus).isVisible();
});

test('Send attachment', async () => {
    const iframe = page.frameLocator(WIDGET_LOCATORS.kmIframe);
    const fileChooserPromise = page.waitForEvent('filechooser');
    await iframe.locator(WIDGET_LOCATORS.kmAttachmentBtn).click();
    const fileChooser = await fileChooserPromise;

    // Change file path to '../utils/hokage.jpg' if running inside the tests folder
    await fileChooser.setFiles('utils/Hokage.jpg');
    await page.waitForTimeout(4000);

    // The message status verify that the message was successfully sent
    await page.locator(WIDGET_LOCATORS.kmMsgStatus).isVisible();
});

test.afterAll(async () => {
    await page.click(LOCATORS.logoutWidgetBtn);
});
