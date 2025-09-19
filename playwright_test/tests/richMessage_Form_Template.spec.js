/*
 * richMessage_Form_Template.spec.js
 * playwright_test/test
 * Created by Archit on 26/01/2023.
 */

import { test, expect } from '@playwright/test';
import {
    WIDGET_LOCATORS,
    LOCATORS,
    COMMON_VALUES,
    RICHMESSAGES_LOCATORS,
} from '../locaterPackage/kmLocators.js';
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

// Testing Form Template
test('Form Template', async () => {
    const iframe = page.frameLocator(WIDGET_LOCATORS.kmIframe);
    await iframe.locator(WIDGET_LOCATORS.kmTextBox).click();
    await iframe.locator(WIDGET_LOCATORS.kmTextBox).type('Form Template');
    await iframe.locator(WIDGET_LOCATORS.kmSendButton).click();
    await page.waitForTimeout(6000);

    const screenshot = await page.screenshot();
    expect(screenshot).toMatchSnapshot(
        {
            threshold: COMMON_VALUES.thresholdValue,
            name: 'FromTemplate.png',
        },
        './richMessage_Form_Template.spec.js-snapshots/'
    );
});

// Testing action Form Template
test('Actions in Form Template', async ({ request }) => {
    const iframe = page.frameLocator(WIDGET_LOCATORS.kmIframe);
    await iframe.locator(RICHMESSAGES_LOCATORS.kmNameInFormTemplate).click();
    await iframe.locator(RICHMESSAGES_LOCATORS.kmNameInFormTemplate).type('Test User');
    await iframe.locator(RICHMESSAGES_LOCATORS.kmPhoneInFormTemplate).click();
    await iframe.locator(RICHMESSAGES_LOCATORS.kmPhoneInFormTemplate).type('1234567890');
    await iframe.locator(RICHMESSAGES_LOCATORS.kmRadioButtonInFormTemplate).click();
    await iframe.locator(RICHMESSAGES_LOCATORS.kmCheckBox1InFormTemplate).click();
    await iframe.locator(RICHMESSAGES_LOCATORS.kmCheckBox2InFormTemplate).click();
    await iframe.locator(RICHMESSAGES_LOCATORS.kmSubmitBtnInFormTemplate).click();

    // The message Response verify that the message was successfully sent
    const req = await request.post('https://testformtemplateforkm.free.beeceptor.com/');
    expect(req.ok()).toBeTruthy();
});

test.afterAll(async () => {
    await page.click(LOCATORS.logoutWidgetBtn);
});
