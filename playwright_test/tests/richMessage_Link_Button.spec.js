/*
 * richMessage_Link_Button.spec.js
 * playwright_test/test
 * Created by Archit on 04/01/2023.
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

// Launching widget
test('Link Button', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
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
    await iframe.locator(WIDGET_LOCATORS.kmTextBox).type('Link Button');
    await iframe.locator(WIDGET_LOCATORS.kmSendButton).click();
    await page.waitForTimeout(2000);

    // The message Response verify that the message was successfully sent
    await page.waitForTimeout(2000);
    const [newPage] = await Promise.all([
        context.waitForEvent('page'), // have to wait until you get event from browser that new page was opened
        await iframe.locator(RICHMESSAGES_LOCATORS.kmLinkButton).click(),
    ]);
    await newPage.isVisible(RICHMESSAGES_LOCATORS.kmLinkOnNewTab);
    await newPage.close();

    // The UI of rich message check using snapshot
    const screenshot = await page.screenshot();
    expect(screenshot).toMatchSnapshot(
        {
            threshold: COMMON_VALUES.thresholdValue,
            name: 'Link_Button.png',
        },
        './richMessage_Link_Button.spec.js-snapshots/'
    );

    // verifying rich message using title and text of button
    const googleButton = await iframe.locator(BUTTON_VERIFICATION.googleButtonInLink).isVisible();
    expect(googleButton).toBe(true);
    const facebookButton = await iframe
        .locator(BUTTON_VERIFICATION.facebookButtonInLink)
        .isVisible();
    expect(facebookButton).toBe(true);

    await page.click(LOCATORS.logoutWidgetBtn);
});
