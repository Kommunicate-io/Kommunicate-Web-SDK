import { test, expect } from '@playwright/test';
import { WIDGET_LOCATORS, LOCATORS } from '../locaterPackage/kmLocators';
import { URL, APP_ID } from '../utils/kmSecret';
import { SCRIPT } from '../utils/kmScript';

async function launchVoiceEnabledWidget(page) {
    await page.goto(URL.kmWidgetURL);
    await page.waitForSelector(LOCATORS.envBtn);
    await page.click(LOCATORS.envBtn);
    await page.click(LOCATORS.appIdField);
    await page.keyboard.press('Meta+A');
    await page.type(LOCATORS.appIdField, APP_ID.kmAppId);
    await page.click(LOCATORS.scriptFiled);
    await page.keyboard.press('Meta+A');
    await page.keyboard.press('Delete');
    await page.type(LOCATORS.scriptFiled, SCRIPT.kmVoiceModeEnabled);
    await page.click(LOCATORS.launchWidgetBtn);
    await page
        .frameLocator(WIDGET_LOCATORS.kmIframe)
        .locator(WIDGET_LOCATORS.kmLaunchWidget)
        .click();
}

test.describe('Conversations Start With Voice CTA', () => {
    let page;

    test.beforeEach(async ({ browser }) => {
        page = await browser.newPage();
        await launchVoiceEnabledWidget(page);
    });

    test.afterEach(async () => {
        await page.click(LOCATORS.logoutWidgetBtn);
    });

    test('renders CTA when voice mode is enabled', async () => {
        const iframe = page.frameLocator(WIDGET_LOCATORS.kmIframe);
        await expect(iframe.locator(WIDGET_LOCATORS.kmStartWithVoiceCta)).toBeVisible();
    });

    test('clicking CTA creates conversation flow and starts voice entry', async () => {
        const frame = page.frame({ name: 'Kommunicate widget iframe' });
        await frame.waitForSelector(WIDGET_LOCATORS.kmStartWithVoiceCta);
        await frame.evaluate(() => {
            window.__kmVoiceStartSource = null;
            window.__kmVoiceStartCount = 0;
            if (window.mckVoice && typeof window.mckVoice.startVoiceMode === 'function') {
                const originalStartVoiceMode = window.mckVoice.startVoiceMode.bind(window.mckVoice);
                window.mckVoice.startVoiceMode = function (source, options) {
                    window.__kmVoiceStartSource = source;
                    window.__kmVoiceStartCount += 1;
                    return Promise.resolve(true);
                };
                window.__restoreStartVoiceMode = function () {
                    window.mckVoice.startVoiceMode = originalStartVoiceMode;
                };
            }
        });

        await frame.click(WIDGET_LOCATORS.kmStartWithVoiceCta);
        await page.waitForTimeout(1000);

        const voiceStartStats = await frame.evaluate(() => ({
            source: window.__kmVoiceStartSource,
            count: window.__kmVoiceStartCount,
        }));
        expect(voiceStartStats.count).toBe(1);
        expect(voiceStartStats.source).toBe('conversations_screen');
    });

    test('permission denied falls back to chat with warning message', async () => {
        const frame = page.frame({ name: 'Kommunicate widget iframe' });
        await frame.waitForSelector(WIDGET_LOCATORS.kmStartWithVoiceCta);
        await frame.evaluate(() => {
            if (window.mckVoice && typeof window.mckVoice.startVoiceMode === 'function') {
                window.mckVoice.startVoiceMode = function (source, options) {
                    if (options && typeof options.onPermissionDenied === 'function') {
                        options.onPermissionDenied({ name: 'NotAllowedError' });
                    }
                    return Promise.resolve(false);
                };
            }
        });

        await frame.click(WIDGET_LOCATORS.kmStartWithVoiceCta);
        await expect(frame.locator(WIDGET_LOCATORS.kmMsgError)).toContainText(
            'Microphone permission is required for voice mode.'
        );
    });
});
