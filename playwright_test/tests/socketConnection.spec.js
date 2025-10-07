import { test, expect } from '@playwright/test';
import { WIDGET_LOCATORS, LOCATORS } from '../locaterPackage/kmLocators';
import { URL, APP_ID } from '../utils/kmSecret';
import { SCRIPT } from '../utils/kmScript';

const isWidgetSocketUrl = (url) => /\/stomp/i.test(url) || /kommunicate\.(?:io|net)\/ws/i.test(url);

const createSocketTracker = (page, log) => {
    const socketRecords = [];

    page.on('websocket', (ws) => {
        const url = ws.url();
        if (!isWidgetSocketUrl(url)) {
            return;
        }

        const record = { ws, url, openedAt: Date.now(), closedAt: null };
        socketRecords.push(record);
        log?.(`socket:open url=${url} openedAt=${record.openedAt} total=${socketRecords.length}`);

        ws.on('close', () => {
            record.closedAt = Date.now();
            log?.(
                `socket:close url=${record.url} openedAt=${record.openedAt} closedAt=${record.closedAt}`
            );
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

const WIDGET_FRAME_NAME = 'Kommunicate widget iframe';

const waitForWidgetFrame = async (page, timeout = 5000) => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        const frame = page.frame({ name: WIDGET_FRAME_NAME });
        if (frame) {
            return frame;
        }
        await page.waitForTimeout(50);
    }
    throw new Error('Kommunicate widget iframe not found');
};

const waitForWidgetState = async (page, expectedState, log) => {
    const frame = await waitForWidgetFrame(page);
    await frame.waitForFunction(
        (state) =>
            !!window.KommunicateCommons && window.KommunicateCommons.IS_WIDGET_OPEN === state,
        expectedState,
        { timeout: 5000 }
    );
    log?.(`widget state ${expectedState ? 'open' : 'closed'}`);
    return frame;
};

const closeWidgetUI = async (page, getCloseButtonLocator, log) => {
    const closeButton = getCloseButtonLocator();
    let closeButtonVisible = false;
    try {
        await closeButton.waitFor({ state: 'visible', timeout: 500 });
        closeButtonVisible = true;
    } catch (error) {
        closeButtonVisible = false;
    }

    if (closeButtonVisible) {
        await closeButton.click();
    } else {
        const frame = await waitForWidgetFrame(page);
        await frame.evaluate(() => {
            if (window.KommunicateCommons?.IS_WIDGET_OPEN) {
                window.KommunicateCommons.setWidgetStateOpen(false);
            }
        });
        log?.('close fallback -> setWidgetStateOpen(false)');
    }

    await waitForWidgetState(page, false, log);
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
    const iframe = await waitForWidgetFrame(page);
    await iframe.waitForFunction(
        (status) => window.IS_SOCKET_CONNECTED === status,
        expectedStatus,
        { timeout: 5000 }
    );
    return iframe;
};

test.describe('Widget Socket Connection', () => {
    test('creates a single socket connection when launcher is clicked', async ({ page }) => {
        const log = (...parts) => console.log('[socket-test]', ...parts);
        const tracker = createSocketTracker(page, log);
        const { launcher, getCloseButtonLocator } = await configureWidgetPreview(page);

        const firstSocketPromise = tracker.waitForSocketRecord();
        const clickTimestamp = Date.now();
        await launcher.click();
        const socketRecord = await firstSocketPromise;

        expect(socketRecord.openedAt).toBeGreaterThanOrEqual(clickTimestamp);
        expect(tracker.socketRecords.length).toBe(1);
        expect(tracker.activeSocketCount()).toBe(1);
        log(
            `after first click sockets=${
                tracker.socketRecords.length
            } active=${tracker.activeSocketCount()}`
        );

        await waitForWidgetState(page, true, log);
        const iframe = await waitForSocketStatus(page, true);

        const uniqueSocketUrls = new Set(tracker.socketRecords.map((record) => record.url));
        expect(uniqueSocketUrls.size).toBe(1);

        await closeWidgetUI(page, getCloseButtonLocator, log);

        expect(tracker.socketRecords.length).toBe(1);
        expect(tracker.activeSocketCount()).toBe(1);
        log(
            `after close sockets=${
                tracker.socketRecords.length
            } active=${tracker.activeSocketCount()}`
        );

        // Cleanup to keep the test isolated
        await iframe.evaluate(() => {
            if (window.Applozic?.ALSocket) {
                window.Applozic.ALSocket.disconnect();
            }
        });
        await tracker.waitForRecordClose(socketRecord);
        expect(tracker.activeSocketCount()).toBe(0);
        log('cleanup complete active=0');
    });

    test('reconnects once after manual disconnect and ignores repeated launcher clicks', async ({
        page,
    }) => {
        const log = (...parts) => console.log('[socket-test]', ...parts);
        const tracker = createSocketTracker(page, log);
        const { launcher, getCloseButtonLocator } = await configureWidgetPreview(page);

        const initialSocketPromise = tracker.waitForSocketRecord();
        await launcher.click();
        const initialSocket = await initialSocketPromise;
        log(
            `initial connect sockets=${
                tracker.socketRecords.length
            } active=${tracker.activeSocketCount()}`
        );

        await waitForSocketStatus(page, true);
        await waitForWidgetState(page, true, log);

        // Close the widget UI but keep the socket alive
        await closeWidgetUI(page, getCloseButtonLocator, log);

        expect(tracker.socketRecords.length).toBe(1);
        expect(tracker.activeSocketCount()).toBe(1);
        log(
            `after closing UI sockets=${
                tracker.socketRecords.length
            } active=${tracker.activeSocketCount()}`
        );

        // Manually disconnect the socket and wait for closure
        const iframe = await waitForWidgetFrame(page);
        await iframe.evaluate(() => {
            if (window.Applozic?.ALSocket) {
                window.Applozic.ALSocket.disconnect();
            }
        });
        log('manual disconnect invoked via iframe');
        await tracker.waitForRecordClose(initialSocket);
        expect(tracker.activeSocketCount()).toBe(0);
        log(
            `after manual disconnect sockets=${
                tracker.socketRecords.length
            } active=${tracker.activeSocketCount()}`
        );

        await waitForSocketStatus(page, false);

        const openWidget = async ({ expectNewSocket }) => {
            const beforeCount = tracker.socketRecords.length;
            const socketPromise = expectNewSocket ? tracker.waitForSocketRecord() : null;

            await launcher.click();
            await waitForWidgetState(page, true, log);
            log(
                `launcher click expectNewSocket=${expectNewSocket} sockets=${
                    tracker.socketRecords.length
                } active=${tracker.activeSocketCount()}`
            );

            if (expectNewSocket) {
                const record = await socketPromise;
                expect(tracker.socketRecords.length).toBe(beforeCount + 1);
                expect(record.closedAt).toBeNull();
                log(
                    `new socket established url=${record.url} openedAt=${record.openedAt} total=${tracker.socketRecords.length}`
                );
                return record;
            }

            await page.waitForTimeout(500);
            expect(tracker.socketRecords.length).toBe(beforeCount);
            return tracker.socketRecords[tracker.socketRecords.length - 1];
        };

        const closeWidget = async () => {
            await closeWidgetUI(page, getCloseButtonLocator, log);
            log(
                `widget closed sockets=${
                    tracker.socketRecords.length
                } active=${tracker.activeSocketCount()}`
            );
        };

        const reconnectedSocket = await openWidget({ expectNewSocket: true });
        expect(tracker.activeSocketCount()).toBe(1);
        log(
            `after reconnection sockets=${
                tracker.socketRecords.length
            } active=${tracker.activeSocketCount()}`
        );

        const uniqueSocketUrls = new Set(tracker.socketRecords.map((record) => record.url));
        expect(uniqueSocketUrls.size).toBe(1);

        await closeWidget();
        expect(tracker.activeSocketCount()).toBe(1);
        log(
            `after closing post-reconnect sockets=${
                tracker.socketRecords.length
            } active=${tracker.activeSocketCount()}`
        );

        for (let attempt = 0; attempt < 3; attempt += 1) {
            const beforeCount = tracker.socketRecords.length;
            await openWidget({ expectNewSocket: false });
            expect(tracker.socketRecords.length).toBe(beforeCount);
            expect(tracker.activeSocketCount()).toBe(1);
            await closeWidget();
            log(
                `repeat attempt=${attempt + 1} sockets=${
                    tracker.socketRecords.length
                } active=${tracker.activeSocketCount()}`
            );
        }

        expect(tracker.socketRecords.length).toBe(2);
        expect(tracker.activeSocketCount()).toBe(1);
        log(
            `before final cleanup sockets=${
                tracker.socketRecords.length
            } active=${tracker.activeSocketCount()}`
        );

        // Final cleanup
        await iframe.evaluate(() => {
            if (window.Applozic?.ALSocket) {
                window.Applozic.ALSocket.disconnect();
            }
        });
        await tracker.waitForRecordClose(reconnectedSocket);
        expect(tracker.activeSocketCount()).toBe(0);
        log(`final cleanup active=${tracker.activeSocketCount()}`);
    });
});
