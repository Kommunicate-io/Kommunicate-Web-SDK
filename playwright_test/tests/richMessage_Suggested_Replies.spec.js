/*
 * richMessage_Suggested_Replies.spec.js
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
    await page
        .frameLocator(WIDGET_LOCATORS.kmIframe)
        .locator(WIDGET_LOCATORS.kmLaunchWidget)
        .click();
});

// Testing Suggested Replies
test('Suggested Replies', async () => {
    const iframe = page.frameLocator(WIDGET_LOCATORS.kmIframe);
    await iframe.locator(WIDGET_LOCATORS.kmTextBox).click();
    await iframe.locator(WIDGET_LOCATORS.kmTextBox).type('Suggested Replies');
    await iframe.locator(WIDGET_LOCATORS.kmSendButton).click();
    await page.waitForTimeout(2000);

    // The message Response verify that the message was successfully sent
    await iframe.locator(RICHMESSAGES_LOCATORS.kmSuggestedRepliesYesBtn).click();
    await page.waitForTimeout(2000);
    const isVisible = await iframe
        .locator(RICHMESSAGES_LOCATORS.kmSuggestedRepliesYesBtnResponse)
        .isVisible();
    expect(isVisible).toBe(true);

    // The UI of rich message check using snapshot
    const screenshot = await page.screenshot();
    expect(screenshot).toMatchSnapshot(
        {
            threshold: COMMON_VALUES.thresholdValue,
            name: 'Suggested_Replies.png',
        },
        './richMessage_Suggested_Replies.spec.js-snapshots/'
    );

    // verifying rich message using title and text of button
    const yesButton = await iframe.locator(BUTTON_VERIFICATION.yesInSuggestedReplies).isVisible();
    expect(yesButton).toBe(true);
    const NoButton = await iframe.locator(BUTTON_VERIFICATION.noInSuggestedReplies).isVisible();
    expect(NoButton).toBe(true);
});

test.afterAll(async () => {
    await page.click(LOCATORS.logoutWidgetBtn);
});
