/*
 * richMessage_Submit_Button.spec.js
 * playwright_test/test
 * Created by Archit on 08/01/2023.
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

// Testing Submit Button
test('Submit Button', async ({ request }) => {
    const iframe = page.frameLocator(WIDGET_LOCATORS.kmIframe);
    await iframe.locator(WIDGET_LOCATORS.kmTextBox).click();
    await iframe.locator(WIDGET_LOCATORS.kmTextBox).type('Submit Button');
    await iframe.locator(WIDGET_LOCATORS.kmSendButton).click();
    await page.waitForTimeout(2000);
    await iframe.locator(RICHMESSAGES_LOCATORS.kmSubmitButton).click();

    // The message Response verify that the message was successfully sent
    const req = await request.post('https://testsubmitbuttonforkm.free.beeceptor.com/');
    expect(req.ok()).toBeTruthy();

    // The UI of rich message check using snapshot
    const screenshot = await page.screenshot();
    expect(screenshot).toMatchSnapshot(
        {
            threshold: COMMON_VALUES.thresholdValue,
            name: 'Submit_Button.png',
        },
        './richMessage_Submit_Button.spec.js-snapshots/'
    );

    // verifying rich message using title and text of button
    const submitButton = await iframe.locator(BUTTON_VERIFICATION.payButtonInSubmit).isVisible();
    expect(submitButton).toBe(true);
});

test.afterAll(async () => {
    await page.click(LOCATORS.logoutWidgetBtn);
});
