/*
 * richMessage_Link_Button.spec.js
 * playwright_test/test
 * Created by Archit on 04/01/2023. 
 */

import { test, expect } from '@playwright/test';
import { widgetLocators, locators, richMessagesLocators } from '../locaterPackage/kmLocators';
import { url , app_id } from '../utils/kmSecret';
import { script } from '../utils/kmScript';

// Launching widget
test("Link Button", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(url.kmWidgetURL);
  await page.waitForSelector(locators.envBtn);
  await page.click(locators.envBtn);
  await page.click(locators.appIdField);
  await page.keyboard.press('Meta+A');
  await page.type(locators.appIdField, app_id.kmAppId);
  await page.click(locators.scriptFiled);
  await page.keyboard.press('Meta+A');
  await page.keyboard.press('Delete');
  await page.type(locators.scriptFiled, script.kmSendMessageScript);
  await page.click(locators.launchWidgetBtn);
  const iframe = page.frameLocator(widgetLocators.kmIframe);
  await iframe.locator(widgetLocators.kmLaunchWidget)
              .click();
  await iframe.locator(widgetLocators.kmTextBox)
              .click();
  await iframe.locator(widgetLocators.kmTextBox)
              .type("Link Button");
  await iframe.locator(widgetLocators.kmSendButton)
              .click();
  await page.waitForTimeout(2000);

  // The message Response verify that the message was successfully sent
  await page.waitForTimeout(2000);
  const [newPage] = await Promise.all([
    context.waitForEvent('page'), // have to wait until you get event from browser that new page was opened
    await iframe.locator(richMessagesLocators.kmLinkButton)
                .click(),
  ]);
  await newPage.isVisible(richMessagesLocators.kmLinkOnNewTab);
  await newPage.close();

  // The UI of rich message check using snapshot
  expect(await page.screenshot()).toMatchSnapshot('Link_Button.png', { threshold: 1 });

  await page.click(locators.logoutWidgetBtn);
});
