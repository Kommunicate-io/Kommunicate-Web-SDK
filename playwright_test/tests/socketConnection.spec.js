import { test, expect } from '@playwright/test';
import { WIDGET_LOCATORS, LOCATORS } from '../locaterPackage/kmLocators';
import { URL, APP_ID } from '../utils/kmSecret';
import { SCRIPT } from '../utils/kmScript';

const isWidgetSocketUrl = (url) => /\/stomp/i.test(url) || /kommunicate\.(?:io|net)\/ws/i.test(url);

const createSocketTracker = (page) => {
    const socketRecords = [];

    page.on('websocket', (ws) => {
        const url = ws.url();
        if (!isWidgetSocketUrl(url)) {
            return;
        }

        const record = { ws, url, openedAt: Date.now(), closedAt: null };
        socketRecords.push(record);

        ws.on('close', () => {
            record.closedAt = Date.now();
        });
    });

    const waitForSocketRecord = async () => {
        await page.waitForEvent('websocket', (ws) => isWidgetSocketUrl(ws.url()));
        return socketRecords[socketRecords.length - 1];
    };

    const waitForRecordClose = async (record) => {
        if (record.closedAt != null) {
            return;
        }
        await new Promise((resolve) => record.ws.on('close', resolve));
    };

    const activeSocketCount = () =>
        socketRecords.filter((record) => record.closedAt === null).length;

    return {
        socketRecords,
        waitForSocketRecord,
        waitForRecordClose,
        activeSocketCount,
    };
};

const configureWidgetPreview = async (page) => {
    await page.goto(URL.kmWidgetURL);

    await page.waitForSelector(LOCATORS.envBtn);
    await page.click(LOCATORS.envBtn);
    await page.click(LOCATORS.appIdField);
    await page.keyboard.press('Meta+A');
    await page.type(LOCATORS.appIdField, APP_ID.kmAppId);
    await page.click(LOCATORS.scriptFiled);
    await page.keyboard.press('Meta+A');
    await page.keyboard.press('Delete');
    await page.type(LOCATORS.scriptFiled, SCRIPT.kmAllBooleanIsTrue);
    await page.click(LOCATORS.launchWidgetBtn);

    const iframeLocator = await page.frameLocator(WIDGET_LOCATORS.kmIframe);
    const launcher = iframeLocator.locator(WIDGET_LOCATORS.kmLaunchWidget);
    const getCloseButtonLocator = () =>
        page.frameLocator(WIDGET_LOCATORS.kmIframe).locator('#km-chat-widget-close-button');

    return { iframeLocator, launcher, getCloseButtonLocator };
};

const waitForSocketStatus = async (page, expectedStatus) => {
    const iframe = await page.frame({ name: 'Kommunicate widget iframe' });
    await iframe.waitForFunction((status) => window.IS_SOCKET_CONNECTED === status, expectedStatus);
    return iframe;
};

test.describe('Widget Socket Connection', () => {
    test('creates a single socket connection when launcher is clicked', async ({ page }) => {
        const tracker = createSocketTracker(page);
        const { launcher, getCloseButtonLocator } = await configureWidgetPreview(page);

        const firstSocketPromise = tracker.waitForSocketRecord();
        const clickTimestamp = Date.now();
        await launcher.click();
        const socketRecord = await firstSocketPromise;

        expect(socketRecord.openedAt).toBeGreaterThanOrEqual(clickTimestamp);
        expect(tracker.socketRecords.length).toBe(1);
        expect(tracker.activeSocketCount()).toBe(1);

        const iframe = await waitForSocketStatus(page, true);
        await page.waitForTimeout(2000);

        const closeButton = getCloseButtonLocator();
        await closeButton.waitFor({ state: 'visible' });
        await page.waitForTimeout(500);

        const uniqueSocketUrls = new Set(tracker.socketRecords.map((record) => record.url));
        expect(uniqueSocketUrls.size).toBe(1);

        await closeButton.click();
        await closeButton.waitFor({ state: 'hidden' });
        await page.waitForTimeout(500);

        expect(tracker.socketRecords.length).toBe(1);
        expect(tracker.activeSocketCount()).toBe(1);

        // Cleanup to keep the test isolated
        await iframe.evaluate(() => {
            if (window.Applozic?.ALSocket) {
                window.Applozic.ALSocket.disconnect();
            }
        });
        await tracker.waitForRecordClose(socketRecord);
        expect(tracker.activeSocketCount()).toBe(0);
    });

    test('reconnects once after manual disconnect and ignores repeated launcher clicks', async ({
        page,
    }) => {
        const tracker = createSocketTracker(page);
        const { launcher, getCloseButtonLocator } = await configureWidgetPreview(page);

        const initialSocketPromise = tracker.waitForSocketRecord();
        await launcher.click();
        const initialSocket = await initialSocketPromise;

        await waitForSocketStatus(page, true);
        await page.waitForTimeout(1000);

        const closeButton = getCloseButtonLocator();
        await closeButton.waitFor({ state: 'visible' });

        // Close the widget UI but keep the socket alive
        await closeButton.click();
        await closeButton.waitFor({ state: 'hidden' });
        await page.waitForTimeout(500);

        expect(tracker.socketRecords.length).toBe(1);
        expect(tracker.activeSocketCount()).toBe(1);

        // Manually disconnect the socket and wait for closure
        const iframe = await page.frame({ name: 'Kommunicate widget iframe' });
        await iframe.evaluate(() => {
            if (window.Applozic?.ALSocket) {
                window.Applozic.ALSocket.disconnect();
            }
        });
        await tracker.waitForRecordClose(initialSocket);
        expect(tracker.activeSocketCount()).toBe(0);

        await waitForSocketStatus(page, false);

        const openWidget = async ({ expectNewSocket }) => {
            const beforeCount = tracker.socketRecords.length;
            const socketPromise = expectNewSocket ? tracker.waitForSocketRecord() : null;

            await launcher.click();
            await getCloseButtonLocator().waitFor({ state: 'visible' });
            await page.waitForTimeout(500);

            if (expectNewSocket) {
                const record = await socketPromise;
                expect(tracker.socketRecords.length).toBe(beforeCount + 1);
                expect(record.closedAt).toBeNull();
                return record;
            }

            await page.waitForTimeout(500);
            expect(tracker.socketRecords.length).toBe(beforeCount);
            return tracker.socketRecords[tracker.socketRecords.length - 1];
        };

        const closeWidget = async () => {
            await getCloseButtonLocator().click();
            await getCloseButtonLocator().waitFor({ state: 'hidden' });
            await page.waitForTimeout(300);
        };

        const reconnectedSocket = await openWidget({ expectNewSocket: true });
        expect(tracker.activeSocketCount()).toBe(1);

        const uniqueSocketUrls = new Set(tracker.socketRecords.map((record) => record.url));
        expect(uniqueSocketUrls.size).toBe(1);

        await closeWidget();
        expect(tracker.activeSocketCount()).toBe(1);

        for (let attempt = 0; attempt < 3; attempt += 1) {
            const beforeCount = tracker.socketRecords.length;
            await openWidget({ expectNewSocket: false });
            expect(tracker.socketRecords.length).toBe(beforeCount);
            expect(tracker.activeSocketCount()).toBe(1);
            await closeWidget();
        }

        expect(tracker.socketRecords.length).toBe(2);
        expect(tracker.activeSocketCount()).toBe(1);

        // Final cleanup
        await iframe.evaluate(() => {
            if (window.Applozic?.ALSocket) {
                window.Applozic.ALSocket.disconnect();
            }
        });
        await tracker.waitForRecordClose(reconnectedSocket);
        expect(tracker.activeSocketCount()).toBe(0);
    });
});
