/*
 * richMessage_Document.spec.js
 * playwright_test/test
 * Renders the document rich message (templateId 15) from the widget sources directly,
 * so it runs without a live bot, app id or snapshots.
 */

import { test, expect } from '@playwright/test';
const path = require('path');

const WEBPLUGIN_DIR = path.resolve(__dirname, '../../webplugin');
const WIDGET_SCRIPTS = [
    'lib/js/mustache.js',
    'js/app/km-utils.js',
    'js/app/km-message-markup-1.0.js',
    'js/app/km-richtext-markup-1.0.js',
];
const DOCUMENT_PAYLOAD = [
    { url: 'https://cdn.kommunicate.io/guide.pdf', name: 'guide.pdf' },
    { url: 'javascript:alert(1)', name: 'blocked.pdf' },
    { url: 'https://cdn.kommunicate.io/terms.docx', name: '<b>terms</b>.docx' },
];

let page;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.setContent('<div id="km-test-container"></div>');
    // km-utils.js reads these globals from the loader script.
    await page.evaluate(() => {
        window.kommunicate = { _globals: {}, PRODUCT_ID: 'kommunicate' };
    });
    for (const script of WIDGET_SCRIPTS) {
        await page.addScriptTag({ path: path.join(WEBPLUGIN_DIR, script) });
    }
});

test.afterAll(async () => {
    await page.close();
});

test('Document template id is 15', async () => {
    const templateId = await page.evaluate(
        () => KommunicateConstants.ACTIONABLE_MESSAGE_TEMPLATE.DOCUMENT
    );
    expect(templateId).toBe('15');
});

test('Document renders like a document received from an agent', async () => {
    const container = page.locator('#km-test-container');
    await page.evaluate((payload) => {
        document.getElementById(
            'km-test-container'
        ).innerHTML = Kommunicate.markup.getDocumentMarkup({ payload: JSON.stringify(payload) });
    }, DOCUMENT_PAYLOAD);

    const documents = container.locator('.km-attachment-wrapper');
    await expect(documents).toHaveCount(2);

    const guideLink = documents.nth(0).locator('a');
    await expect(guideLink).toHaveAttribute('href', 'https://cdn.kommunicate.io/guide.pdf');
    await expect(guideLink).toHaveAttribute('target', '_blank');
    await expect(documents.nth(0).locator('.km-attachment-file-name')).toHaveText('guide.pdf');
    await expect(documents.nth(0).locator('.km-attachment-download-icon')).toHaveClass(/\bvis\b/);
    await expect(documents.nth(0).locator('.km-attachment-progress-bar-wrapper')).toHaveClass(
        /n-vis/
    );

    // File names are escaped, and non-http links are never rendered.
    await expect(documents.nth(1).locator('.km-attachment-file-name')).toHaveText(
        '<b>terms</b>.docx'
    );
    await expect(container.locator('b')).toHaveCount(0);
    await expect(container.locator('a[href^="javascript"]')).toHaveCount(0);
});

test('Document markup matches the agent document bubble structure', async () => {
    const classLists = await page.evaluate(() => {
        const toClassTree = (html) => {
            const wrapper = document.createElement('div');
            wrapper.innerHTML = html;
            return Array.from(wrapper.querySelectorAll('*')).map((node) =>
                Array.from(node.classList)
                    // Ignore per-message-key classes (e.g. "mck-attachment-{{key}}"); bot documents have no key.
                    .filter((name) => !/-\d|^mck-attachment-$|^km-.*-$/.test(name))
                    .sort()
                    .join(' ')
            );
        };
        const url = 'https://cdn.kommunicate.io/guide.pdf';
        const agentDocument = Kommunicate.messageTemplate.getAttachmentContanier(
            { type: 4, fileMeta: { name: 'guide.pdf', url, contentType: 'application/pdf' } },
            '',
            false,
            url
        );
        const botDocument = Kommunicate.markup.getDocumentMarkup({
            payload: [{ url, name: 'guide.pdf' }],
        });
        return { agent: toClassTree(agentDocument), bot: toClassTree(botDocument) };
    });

    expect(classLists.bot).toEqual(classLists.agent);
});
