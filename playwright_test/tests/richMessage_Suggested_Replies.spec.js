/*
 * richMessage_Suggested_Replies.spec.js
 * playwright_test/test
 * Created by Archit on 01/01/2023. 
 */

import { test, expect } from '@playwright/test';
import { widgetLocators, locators, richMessagesLocators, common_Values } from '../locaterPackage/kmLocators';
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

  // Testing Suggested Replies
  test("Suggested Replies", async () => {
    const iframe = page.frameLocator(widgetLocators.kmIframe)
    await iframe.locator(widgetLocators.kmTextBox)
                .click();
    await iframe.locator(widgetLocators.kmTextBox)
                .type("Suggested Replies");
    await iframe.locator(widgetLocators.kmSendButton)
                .click();
    await page.waitForTimeout(2000)

  // The message Response verify that the message was successfully sent
    await iframe.locator(richMessagesLocators.kmSuggestedRepliesYesBtn)
                .click();
    await page.waitForTimeout(2000)
    const isVisible = await iframe.locator(richMessagesLocators.kmSuggestedRepliesYesBtnResponse).isVisible();
    expect(isVisible).toBe(true);

  // The UI of rich message check using snapshot
    const screenshot = await page.screenshot();
    expect(screenshot).toMatchSnapshot({
      threshold: common_Values.thresholdValue,
      name: 'Suggested_Replies.png'
    }, './richMessage_Suggested_Replies.spec.js-snapshots/');
  })

  test.afterAll(async () => {
    await page.click(locators.logoutWidgetBtn)
  })