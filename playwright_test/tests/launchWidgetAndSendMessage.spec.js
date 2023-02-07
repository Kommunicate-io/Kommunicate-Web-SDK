
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
  test.beforeAll(async ({browser}) => {
    page = await browser.newPage();
    await page.goto(URL.kmWidgetURL);
    await page.waitForSelector(LOCATORS.envBtn);
    await page.click(LOCATORS.envBtn);
    await page.click(LOCATORS.appIdField);

  })


  test.afterAll(async () => {
    await page.click(LOCATORS.logoutWidgetBtn)
  })
