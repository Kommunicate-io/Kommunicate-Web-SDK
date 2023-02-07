
/*
 * LaunchWidgetAndSendMessage.spec.js
 * playwright_test/test
 * Created by Archit on 20/12/2022. 
 */

import { test, expect } from '@playwright/test';
import { WIDGET_LOCATORS, LOCATORS } from '../locaterPackage/kmLocators';
import { URL , APP_ID } from '../utils/kmSecret';
import { SCRIPT } from '../utils/kmScript';

let page;

// Launching widget
test.setTimeout(300000);
  test.beforeAll(async ({browser}) => {
    test.setTimeout(300000);
    page = await browser.newPage();
    await page.goto(URL.kmWidgetURL);
    await page.waitForSelector(LOCATORS.envBtn);
    await page.click(LOCATORS.envBtn);
    await page.click(LOCATORS.appIdField);

  })

  // Testing chat creation and message sending
  test("send message", async () => {
     await page.keyboard
              .press('Meta+A');
    await page.type(LOCATORS.appIdField, APP_ID.kmAppId);
    await page.click(LOCATORS.scriptFiled);
    await page.keyboard
              .press('Meta+A');
    await page.keyboard
              .press('Delete');
    await page.type(LOCATORS.scriptFiled,SCRIPT.kmSendMessageScript);
    await page.click(LOCATORS.launchWidgetBtn);
 
  })

  test.afterAll(async () => {
    await page.click(LOCATORS.logoutWidgetBtn)
  })
