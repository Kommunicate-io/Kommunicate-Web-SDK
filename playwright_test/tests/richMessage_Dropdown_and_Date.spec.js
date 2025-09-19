/*
 * richMessage_Dropdown_and_Date.spec.js
 * playwright_test/test
 * Created by Archit on 27/01/2023.
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

// Testing Form Dropdown and Date
test('Form Dropdown and Date', async () => {
    const iframe = page.frameLocator(WIDGET_LOCATORS.kmIframe);
    await iframe.locator(WIDGET_LOCATORS.kmTextBox).click();
    await iframe.locator(WIDGET_LOCATORS.kmTextBox).type('Form Dropdown and Date');
    await iframe.locator(WIDGET_LOCATORS.kmSendButton).click();
    await page.waitForTimeout(6000);

    const screenshot = await page.screenshot();
    expect(screenshot).toMatchSnapshot(
        {
            threshold: COMMON_VALUES.thresholdValue,
            name: 'DateAndDropdown.png',
        },
        './richMessage_Dropdown_and_Date.spec.js-snapshots/'
    );
});

// Testing action Form Template
test('Actions in Form Template', async ({ request }) => {
    const iframe = page.frameLocator(WIDGET_LOCATORS.kmIframe);
    await iframe
        .locator(RICHMESSAGES_LOCATORS.kmDropDownInFormTemplate)
        .selectOption({ label: 'Entrepreneur' });
    // .click();
    await iframe.locator(RICHMESSAGES_LOCATORS.kmTextAreaInFormTemplate).click();
    await iframe.locator(RICHMESSAGES_LOCATORS.kmTextAreaInFormTemplate).type('Hello how are you?');
    let date = '26/02/1996';
    await iframe.locator(RICHMESSAGES_LOCATORS.kmDateInFormTemplate).type(date);
    await iframe.locator(RICHMESSAGES_LOCATORS.kmSubmitBtnInFormTemplate).click();

    // The message Response verify that the message was successfully sent
    const req = await request.post('https://testformdropdownlistforkm.free.beeceptor.com/');
    expect(req.ok()).toBeTruthy();
});

test.afterAll(async () => {
    await page.click(LOCATORS.logoutWidgetBtn);
});
