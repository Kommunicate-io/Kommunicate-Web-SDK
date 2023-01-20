/*
 * richMessage_Submit_Button.spec.js
 * playwright_test/test
 * Created by Archit on 08/01/2023. 
 */

import { test, expect } from '@playwright/test';
import { widgetLocators, locators, richMessagesLocators } from '../locaterPackage/kmLocators';
import { url , app_id } from '../utils/kmSecret';
import { script } from '../utils/kmScript';

let page;

// Launching widget
  test.beforeAll(async ({browser}) => {
    page = await browser.newPage();
    await page.goto(url.kmWidgetURL);
    await page.waitForSelector(locators.envBtn);
    await page.click(locators.envBtn);
    await page.click(locators.appIdField);
    await page.keyboard
              .press('Meta+A');
    await page.type(locators.appIdField, app_id.kmAppId);
    await page.click(locators.scriptFiled);
    await page.keyboard
              .press('Meta+A');
    await page.keyboard
              .press('Delete');
    await page.type(locators.scriptFiled,script.kmSendMessageScript);
    await page.click(locators.launchWidgetBtn);
    await page.frameLocator(widgetLocators.kmIframe)
              .locator(widgetLocators.kmLaunchWidget)
              .click();
  })

  // Testing Submit Button
  test("Submit Button", async ({ request }) => {
    const iframe = page.frameLocator(widgetLocators.kmIframe)
    await iframe.locator(widgetLocators.kmTextBox)
                .click();
    await iframe.locator(widgetLocators.kmTextBox)
                .type("Submit Button");
    await iframe.locator(widgetLocators.kmSendButton)
                .click();
    await page.waitForTimeout(2000)
    await iframe.locator(richMessagesLocators.kmSubmitButton)
                .click();
                
  // The message Response verify that the message was successfully sent
    const req = await request.post('https://testsubmitbuttonforkm.free.beeceptor.com/');
    expect(req.ok()).toBeTruthy();

  // The UI of rich message check using snapshot
    const screenshot = await page.screenshot();
    expect(screenshot).toMatchSnapshot({
      threshold: 0.98,
      name: 'Submit_Button.png'
    }, './richMessage_Submit_Button.spec.js-snapshots/');

  })

  test.afterAll(async () => {
    await page.click(locators.logoutWidgetBtn)
  })