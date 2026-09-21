// Dependency-free runner regression tests: node tools/rich-message-tests/runner.test.js
const assert = require('assert');
const runner = require('../../example/rich-message-tests/runner');
const cases = require('../../example/rich-message-tests/cases.json');

async function main() {
    assert(runner.allowed('widget-test.kommunicate.io'));
    assert(runner.allowed('localhost'));
    assert(!runner.allowed('dashboard.kommunicate.io'));
    assert(!runner.allowed('widget-test.kommunicate.io.example.com'));
    const doc = { querySelector() {} };
    assert.throws(() => runner.validate([], doc));
    assert.throws(() => runner.validate([{ name: 'Missing expectations' }], doc));
    assert.throws(() => runner.validate([cases[0], cases[0]], doc));
    assert.strictEqual(runner.validate(cases, doc), cases);
    const skip = cases.find(item => item.skipReason);
    assert(skip, 'Export includes an explicitly unsupported autosuggestion case');
    assert.throws(() => runner.validate([{ ...skip, skipReason: '' }], doc));
    const skipped = await runner.run([skip], async () => {
        throw new Error('Skipped cases must not send chat messages');
    }, { aborted: false }, () => {});
    assert.strictEqual(skipped[0].status, 'skipped');
    assert.strictEqual(skipped[0].detail, skip.skipReason);

    const statuses = [];
    const signal = { aborted: false };
    const results = await runner.run(cases.slice(0, 3), async item => {
        if (item === cases[1]) throw new Error('Missing expected button');
    }, signal, rows => statuses.push(rows.map(row => row.status)));
    assert.deepStrictEqual(results.map(row => row.status), ['passed', 'failed', 'passed']);
    assert.strictEqual(results[1].detail, 'Missing expected button');
    assert(statuses.some(row => row.includes('running')));
    let calls = 0;
    const stopped = await runner.run(cases.slice(0, 3), async () => {
        calls++;
        signal.aborted = true;
        throw new Error('Stopped by user');
    }, signal, () => {});
    assert.strictEqual(calls, 1);
    assert.deepStrictEqual(stopped.map(row => row.status), ['stopped', 'stopped', 'stopped']);
    await assert.rejects(runner.waitFor(() => ({ ok: true }), signal), /Stopped/);
    await assert.rejects(runner.waitFor(() => ({ ok: false, reason: 'No bot reply' }), { aborted: false }, 1), /No bot reply/);

    const visible = { getClientRects: () => [1], ownerDocument: { defaultView: { getComputedStyle: () => ({ visibility: 'visible' }) } } };
    let chatClicks = 0;
    let launcherClicks = 0;
    let composerShown = false;
    const startupInput = { ...visible, getClientRects: () => composerShown ? [1] : [] };
    const startupDoc = { querySelector: selector => ({
        '#mck-text-box': startupInput,
        '#mck-msg-sbmt': {},
        '#km-empty-conversation-cta': { ...visible, click() { chatClicks++; } },
        '#launcher-svg-container': { ...visible, getClientRects: () => [], click() { launcherClicks++; } },
    }[selector]) };
    const startup = {};
    assert.strictEqual(runner.openWidget(null, startup), false);
    assert.strictEqual(runner.openWidget(startupDoc, startup), false);
    assert.strictEqual(chatClicks, 1, 'Modern Welcome must start Chat');
    runner.openWidget(startupDoc, startup);
    assert.strictEqual(chatClicks, 1, 'Polling must not create duplicate conversations');
    composerShown = true;
    assert.strictEqual(runner.openWidget(startupDoc, startup), true);
    assert.strictEqual(launcherClicks, 0, 'An open composer must not be toggled closed');
    const events = [];
    let sent = 0;
    const send = { ...visible, disabled: true, click() { sent++; } };
    const input = { ...visible, textContent: '', focus() {}, dispatchEvent(event) {
        events.push(event.type);
        if (event.type === 'input' && this.textContent) send.disabled = false;
    } };
    class InputEvent { constructor(type) { this.type = type; } }
    const composer = { defaultView: { Event: InputEvent, KeyboardEvent: InputEvent },
        querySelector: selector => selector === '#mck-text-box' ? input : send };
    await runner.sendTrigger(composer, 'Buttons', { aborted: false });
    assert.strictEqual(sent, 1, 'An initially disabled Send button must work after text is entered');
    assert.strictEqual(input.textContent, 'Buttons');
    assert.deepStrictEqual(events, ['input', 'keyup']);
    await assert.rejects(runner.sendTrigger(composer, 'Buttons', { aborted: true }), /Stopped/);
    assert.strictEqual(sent, 1, 'Cancellation must not send another message');
    const image = { ...visible, tagName: 'IMG', complete: true, naturalWidth: 0, getAttribute: () => 'broken.png' };
    const message = { ...visible, textContent: 'RM QA: Image', querySelectorAll: () => [image] };
    const frame = { querySelectorAll: () => [message] };
    const item = { responseText: 'RM QA: Image', selectors: ['img'] };
    assert.match(runner.checkResponse(frame, new Set([message]), item), /Waiting/);
    assert.match(runner.checkResponse(frame, new Set(), item), /Image did not load/);
    image.naturalWidth = 100;
    assert.strictEqual(runner.checkResponse(frame, new Set(), item), null);
    message.querySelectorAll = () => [];
    assert.match(runner.checkResponse(frame, new Set(), item), /Missing visible element/);
    message.textContent = 'Fallback response';
    assert.match(runner.checkResponse(frame, new Set(), item), /Waiting/);
    const heading = { ...visible, tagName: 'H1' };
    const shadow = { textContent: 'This is a heading', querySelectorAll: selector => selector === 'h1' ? [heading] : [] };
    message.textContent = '';
    message.querySelectorAll = selector => selector === 'mck-html-rich-message' ? [{ shadowRoot: shadow }] : [];
    const htmlCase = { responseText: 'This is a heading', selectors: ['h1'] };
    assert.strictEqual(runner.checkResponse(frame, new Set(), htmlCase), null);
    assert.match(runner.checkResponse(frame, new Set([message]), htmlCase), /Waiting/);
    shadow.querySelectorAll = () => [];
    assert.match(runner.checkResponse(frame, new Set(), htmlCase), /Missing visible element/);
    console.log('Runner regression tests passed.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
