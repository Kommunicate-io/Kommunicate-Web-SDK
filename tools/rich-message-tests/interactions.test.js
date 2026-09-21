// node tools/rich-message-tests/interactions.test.js
const assert = require('assert');
const runner = require('../../example/rich-message-tests/runner');

async function main() {
    const signal = { aborted: false };
    const doc = { baseURI: 'http://127.0.0.1:8080/demo2.html', querySelectorAll: () => [] };
    class Event { constructor(type) { this.type = type; } }
    doc.defaultView = { Event, getComputedStyle: () => ({ visibility: 'visible' }) };
    const makeElement = overrides => ({
        ownerDocument: doc, getClientRects: () => [1], focus() {}, blur() {}, dispatchEvent() {}, ...overrides,
    });
    const fields = {};
    const message = { querySelectorAll: selector => fields[selector] ? [fields[selector]] : [] };
    const field = makeElement({ value: '' });
    const changes = [];
    field.dispatchEvent = event => changes.push(event.type);
    fields.input = field;
    fields.checkbox = makeElement({ checked: false, click() { this.checked = !this.checked; } });
    await runner.interact(doc, message, [
        { type: 'fill', selector: 'input', value: 'QA Name', label: 'Fill name' },
        { type: 'check', selector: 'checkbox', checked: true, label: 'Check' },
        { type: 'check', selector: 'checkbox', checked: false, label: 'Uncheck' },
    ], signal);
    assert.strictEqual(field.value, 'QA Name');
    assert.deepStrictEqual(changes, ['input', 'change']);
    assert.strictEqual(fields.checkbox.checked, false);
    await assert.rejects(runner.interact(doc, message, [{ type: 'fill', selector: 'missing', value: '', label: 'Missing input' }], signal), /Missing input: Control is missing/);
    const noActions = await runner.interact(doc, message, undefined, signal);
    assert.deepStrictEqual(noActions, []);
    await assert.rejects(runner.interact(doc, message, [{ type: 'fill', selector: 'input', value: 'Do not enter', label: 'Fill' }], { aborted: true }), /Stopped/);
    assert.strictEqual(field.value, 'QA Name');

    let navigated = false;
    const originalOpenWindow = () => { navigated = true; };
    doc.defaultView.open = originalOpenWindow;
    fields.link = makeElement({ click() { doc.defaultView.open('https://example.com', '_blank'); } });
    const link = { type: 'link', selector: 'link', label: 'Link target', url: 'https://example.com', target: '_blank' };
    await runner.interact(doc, message, [link], signal);
    assert.strictEqual(navigated, false);
    assert.strictEqual(doc.defaultView.open, originalOpenWindow);
    await assert.rejects(runner.interact(doc, message, [{ ...link, target: '_self' }], signal), /expected URL and target/);
    assert.strictEqual(doc.defaultView.open, originalOpenWindow);

    const outgoing = [];
    doc.querySelectorAll = () => outgoing;
    fields.reply = makeElement({ click() { outgoing.push(makeElement({ textContent: 'Expected reply' })); } });
    await runner.interact(doc, message, [{ type: 'reply', selector: 'reply', label: 'Reply', expectedText: 'Expected reply' }], signal);
    assert.strictEqual(outgoing.length, 1);

    const delivered = [];
    class XHR {
        open(method, url) { this.method = method; this.url = url; }
        send(body) { delivered.push({ url: this.url, body }); }
        abort() { this.aborted = true; }
    }
    doc.defaultView.XMLHttpRequest = XHR;
    const originalOpen = XHR.prototype.open;
    const originalSend = XHR.prototype.send;
    const form = { action: 'https://example.com/book', classList: { contains: () => false } };
    fields.submit = makeElement({ closest: () => form, getAttribute: () => 'json', click() {
        const xhr = new XHR(); xhr.open('POST', form.action); xhr.send(JSON.stringify({ Name: 'QA Name', music: ['metal'] }));
        const chat = new XHR(); chat.open('POST', 'https://chat-test.kommunicate.io/send'); chat.send('reply');
    } });
    const submit = { type: 'submit', selector: 'submit', label: 'Capture', url: form.action, expectedData: { Name: 'QA Name', music: ['metal'] } };
    await runner.interact(doc, message, [submit], signal);
    assert.deepStrictEqual(delivered.map(request => request.url), ['https://chat-test.kommunicate.io/send']);
    assert.strictEqual(XHR.prototype.open, originalOpen);
    assert.strictEqual(XHR.prototype.send, originalSend);
    fields.submit.getAttribute = () => '';
    await assert.rejects(runner.interact(doc, message, [submit], signal), /Native form navigation is not supported/);
    fields.submit.getAttribute = () => 'json';
    await assert.rejects(runner.interact(doc, message, [{ ...submit, expectedData: { Name: 'Wrong' } }], signal), /Submission field did not match: Name/);
    assert.strictEqual(XHR.prototype.send, originalSend);
    await assert.rejects(runner.interact(doc, message, [{ ...submit, url: 'https://wrong.example/' }], signal), /Form endpoint differs/);
    fields.error = makeElement({});
    const invalid = { ...submit, type: 'invalidSubmit', errorSelector: 'error' };
    await assert.rejects(runner.interact(doc, message, [invalid], signal), /Invalid form attempted a submission/);
    assert.strictEqual(XHR.prototype.open, originalOpen);
    fields.submit.click = () => {};
    await runner.interact(doc, message, [invalid], signal);
    fields.submit.click = () => { throw new Error('Widget error'); };
    await assert.rejects(runner.interact(doc, message, [submit], signal), /Widget error/);
    assert.strictEqual(XHR.prototype.send, originalSend);
    const cancelled = { aborted: false };
    fields.submit.click = () => { cancelled.aborted = true; };
    await assert.rejects(runner.interact(doc, message, [submit], cancelled), /Stopped/);
    assert.strictEqual(XHR.prototype.open, originalOpen);
    assert.strictEqual(XHR.prototype.send, originalSend);
    runner.verifySubmission({ method: 'POST', body: 'Name=QA+Name&music%5B%5D=metal' }, { Name: 'QA Name', music: ['metal'] });
    assert.throws(() => runner.verifySubmission({ method: 'GET', body: '{}' }, {}), /POST/);
    assert.throws(() => runner.validateActions([{ type: 'click', selector: 'button', label: 'Unrestricted click' }], {}), /supported type/);
    console.log('Interaction regression tests passed.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
