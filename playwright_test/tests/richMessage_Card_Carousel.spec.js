/*
 * richMessage_Card_Carousel.spec.js
 * playwright_test/test
 * Created by Archit on 20/01/2023.
 */

import { test, expect } from '@playwright/test';
import {
    WIDGET_LOCATORS,
    LOCATORS,
    COMMON_VALUES,
    BUTTON_VERIFICATION,
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

// Testing Card Carousel
test('Card Carousel', async () => {
    const iframe = page.frameLocator(WIDGET_LOCATORS.kmIframe);
    await iframe.locator(WIDGET_LOCATORS.kmTextBox).click();
    await iframe.locator(WIDGET_LOCATORS.kmTextBox).type('Card Carousel');
    await iframe.locator(WIDGET_LOCATORS.kmSendButton).click();
    await page.waitForTimeout(8000);

    const screenshot = await page.screenshot();
    expect(screenshot).toMatchSnapshot(
        {
            threshold: COMMON_VALUES.thresholdValue,
            name: 'Card_Carousel.png',
        },
        './richMessage_Card_Carousel.spec.js-snapshots/'
    );

    // verifying rich message using title and text of button
    const LinkButton = await iframe.locator(BUTTON_VERIFICATION.linkButtonInCard).isVisible();
    expect(LinkButton).toBe(true);
    const SuggestedRepliesButton = await iframe
        .locator(BUTTON_VERIFICATION.suggestedRepliesInCard)
        .isVisible();
    expect(SuggestedRepliesButton).toBe(true);
    const SubmitButton = await iframe.locator(BUTTON_VERIFICATION.submitButtonInCard).isVisible();
    expect(SubmitButton).toBe(true);
});

test.afterAll(async () => {
    await page.click(LOCATORS.logoutWidgetBtn);
});
