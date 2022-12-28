
/*
 * LaunchWidgetAndSendMessage.spec.js
 * playwright_test/test
 * Created by Archit on 20/12/2011. 
 */

import { test, expect } from '@playwright/test';
import { widgetLocators, locators } from '../locaterPackage/kmLocators';
import { url , app_id } from '../utils/kmSecret';
import { script } from '../utils/kmScript';

let browser;
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

  // Testing chat creation and message sending
  test("send message", async () => {
    const iframe = page.frameLocator(widgetLocators.kmIframe)
    await iframe.locator(widgetLocators.kmTextBox)
                .click();
    await iframe.locator(widgetLocators.kmTextBox)
                .type("hello");
    await iframe.locator(widgetLocators.kmSendButton)
                .click();
    await page.waitForTimeout(3000)

  // The message status verify that the message was successfully sent
    const isVisible = await iframe.locator(widgetLocators.kmMsgStatus).isVisible();
    expect(isVisible).toBe(true);
  })

  test.afterAll(async () => {
    await page.click(locators.logoutWidgetBtn)
  })