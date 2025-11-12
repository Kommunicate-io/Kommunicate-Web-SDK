/*
 * richMessage_Combination_buttons.spec.js
 * playwright_test/test
 * Created by Archit on 01/01/2023.
 */

import { test, expect } from '@playwright/test';
import {
    WIDGET_LOCATORS,
    LOCATORS,
    RICHMESSAGES_LOCATORS,
    COMMON_VALUES,
    BUTTON_VERIFICATION,
} from '../locaterPackage/kmLocators';
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
    const iframe = page.frameLocator(WIDGET_LOCATORS.kmIframe);
    await iframe.locator(WIDGET_LOCATORS.kmLaunchWidget).click();
    await iframe.locator(WIDGET_LOCATORS.kmTextBox).click();
    await iframe.locator(WIDGET_LOCATORS.kmTextBox).type('Combination of different buttons');
    await iframe.locator(WIDGET_LOCATORS.kmSendButton).click();
    await page.waitForTimeout(2000);
});

// Testing Button Combination
test('Combination Suggested Replies', async () => {
    const iframe = page.frameLocator(WIDGET_LOCATORS.kmIframe);

    // The UI of rich message check using snapshot
    const screenshot = await page.screenshot();
    expect(screenshot).toMatchSnapshot(
        {
            threshold: COMMON_VALUES.thresholdValue,
            name: 'Button_Combination.png',
        },
        './richMessage_Combination_buttons.spec.js-snapshots/'
    );
    await iframe.locator(RICHMESSAGES_LOCATORS.kmCombiSuggestedRepliesBtn).click();
    await page.waitForTimeout(2000);

    // The message Response verify that the message was successfully sent
    const isVisible = await iframe
        .locator(RICHMESSAGES_LOCATORS.kmCombiSuggestedRepliesBtnResponse)
        .isVisible();
    expect(isVisible).toBe(true);

    // verifying rich message using title and text of button
    const suggestedRepliesButton = await iframe
        .locator(BUTTON_VERIFICATION.suggestedRepliesInCombi)
        .isVisible();
    expect(suggestedRepliesButton).toBe(true);
});

test('Combination Submit Button', async ({ request }) => {
    const iframe = page.frameLocator(WIDGET_LOCATORS.kmIframe);
    await iframe.locator(RICHMESSAGES_LOCATORS.kmCombiSubmitBtn).click();

    // The message Response verify that the message was successfully sent
    const req = await request.post('https://testcombinationsubmitbutton.free.beeceptor.com/');
    expect(req.ok()).toBeTruthy();

    // verifying rich message using title and text of button
    const submitButton = await iframe.locator(BUTTON_VERIFICATION.submitButtonInCombi).isVisible();
    expect(submitButton).toBe(true);
});

test.afterAll(async () => {
    await page.click(LOCATORS.logoutWidgetBtn);
});
