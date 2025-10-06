/*
 * All_Parameter_False.spec.js
 * playwright_test/test
 * Created by Archit on 01/02/2023.
 */

import { test, expect } from '@playwright/test';
import { WIDGET_LOCATORS, LOCATORS, COMMON_VALUES } from '../locaterPackage/kmLocators';
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
    await page.type(LOCATORS.scriptFiled, SCRIPT.kmAllBooleanIsFalse);
    await page.click(LOCATORS.launchWidgetBtn);
    await page
        .frameLocator(WIDGET_LOCATORS.kmIframe)
        .locator(WIDGET_LOCATORS.kmLaunchWidget)
        .click();
});

// Testing NO UI button in text box
test('NO UI button in text box', async () => {
    await page.waitForTimeout(4000);
    const screenshot = await page.screenshot();
    expect(screenshot).toMatchSnapshot(
        {
            threshold: COMMON_VALUES.thresholdValue,
            name: 'No_UI_Button.png',
        },
        './All_Parameter_False.spec.js-snapshots/'
    );
});

test.afterAll(async () => {
    await page.click(LOCATORS.logoutWidgetBtn);
});
