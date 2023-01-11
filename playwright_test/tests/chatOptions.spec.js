/*
 * chatOptions.spec.js
 * playwright_test/tests
 * Created by Archit on 23/12/2022. 
 * Created by Archit on 23/12/2011. 
 */

import { test, expect } from '@playwright/test';
import { widgetLocators, locators } from '../locaterPackage/kmLocators';
import { url , app_id } from '../utils/kmSecret';
import { script } from '../utils/kmScript';

let page;

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
    await page.type(locators.scriptFiled,script.kmAllBooleanIsTrue);
    await page.click(locators.launchWidgetBtn);
    await page.frameLocator(widgetLocators.kmIframe)
              .locator(widgetLocators.kmLaunchWidget)
              .click();
  })

  test("Send Emoji", async () => {
    const iframe = page.frameLocator(widgetLocators.kmIframe)
    await iframe.locator(widgetLocators.kmEmojiBtn)
                .click();
    await iframe.locator(widgetLocators.kmSmirkEmoji)
                .click();
    await page.keyboard
              .press('Enter');
    await page.waitForTimeout(3000)

  // The message status verify that the message was successfully sent
    const isVisible = await iframe.locator(widgetLocators.kmMsgStatus).isVisible();
    expect(isVisible).toBe(true);
  })

  test("Send Location", async() =>{
    const iframe = page.frameLocator(widgetLocators.kmIframe)
    await iframe.locator(widgetLocators.kmLocBtn)
                .click();
    await iframe.locator(widgetLocators.kmLocSendBtn)
                   .click();
    await page.waitForTimeout(3000)

    // The message status verify that the message was successfully sent
    await page.locator(widgetLocators.kmMsgStatus)
              .isVisible()
  })

  test("Send attachment", async() =>{
    const iframe = page.frameLocator(widgetLocators.kmIframe);
    const fileChooserPromise = page.waitForEvent('filechooser');
    await iframe.locator(widgetLocators.kmAttachmentBtn)
                .click(); 
    const fileChooser = await fileChooserPromise;

    // Change file path to '../utils/hokage.jpg' if running inside the tests folder
    await fileChooser.setFiles('utils/Hokage.jpg'); 
    await page.waitForTimeout(4000)

    // The message status verify that the message was successfully sent
    await page.locator(widgetLocators.kmMsgStatus)
              .isVisible()
  })

  test.afterAll(async () => {
    await page.click(locators.logoutWidgetBtn)
  })