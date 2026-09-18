(function (root) {
    'use strict';
    const allowed = hostname => ['localhost', '127.0.0.1', 'test', 'widget-test.kommunicate.io'].includes(hostname);
    function validate(cases, doc) {
        if (!Array.isArray(cases) || !cases.length || cases.length > 100) {
            throw new Error('Provide between 1 and 100 test cases.');
        }
        const names = new Set();
        cases.forEach(item => {
            if (!item || !['name', 'trigger', 'responseText'].every(key => typeof item[key] === 'string' && item[key].trim())) {
                throw new Error('Each case needs a name, trigger, and unique bot responseText.');
            }
            if (names.has(item.responseText)) throw new Error('Use a different responseText for each case.');
            names.add(item.responseText);
            if (item.skipReason !== undefined) {
                if (typeof item.skipReason !== 'string' || !item.skipReason.trim()) throw new Error('Skipped cases need a reason.');
                return;
            }
            if (!Array.isArray(item.selectors) || !item.selectors.length || item.selectors.some(s => typeof s !== 'string' || !s.trim())) {
                throw new Error('Each case needs at least one CSS selector to check within its bot response.');
            }
            item.selectors.forEach(selector => doc.querySelector(selector));
            validateActions(item.actions === undefined ? [] : item.actions, doc);
        });
        return cases;
    }
    function visible(element) {
        return Boolean(element.getClientRects().length) && element.ownerDocument.defaultView.getComputedStyle(element).visibility !== 'hidden';
    }
    function openWidget(doc, state) {
        if (!doc) return false;
        const input = doc.querySelector('#mck-text-box');
        if (input && visible(input) && doc.querySelector('#mck-msg-sbmt')) return true;
        const chat = doc.querySelector('#km-empty-conversation-cta');
        if (!state.chatStarted && chat && visible(chat)) {
            chat.click();
            state.chatStarted = true;
            return false;
        }
        const launcher = doc.querySelector('#launcher-svg-container');
        if (!state.opened && launcher && visible(launcher)) {
            launcher.click();
            state.opened = true;
        }
        return false;
    }
    const contentRoots = node => [node, ...Array.from(node.querySelectorAll('mck-html-rich-message'))
        .map(element => element.shadowRoot).filter(Boolean)];
    function findResponse(doc, before, item) {
        return Array.from(doc.querySelectorAll('.mck-msg-left')).find(node =>
            !before.has(node) && visible(node) && contentRoots(node).some(root => root.textContent.includes(item.responseText))
        );
    }
    function checkResponse(doc, before, item) {
        const message = findResponse(doc, before, item);
        if (!message) return 'Waiting for a new bot response containing: ' + item.responseText;
        for (const selector of item.selectors) {
            const elements = contentRoots(message).flatMap(root => Array.from(root.querySelectorAll(selector))).filter(visible);
            if (!elements.length) return 'Missing visible element: ' + selector;
            for (const element of elements) {
                if (element.tagName === 'IMG' && (!element.complete || element.naturalWidth === 0)) {
                    return 'Image did not load: ' + element.getAttribute('src');
                }
            }
        }
        return null;
    }
    async function waitFor(probe, signal, timeout = 30000) {
        const deadline = Date.now() + timeout;
        let reason = 'Timed out';
        while (Date.now() < deadline) {
            if (signal.aborted) throw new Error('Stopped by user');
            const result = probe();
            if (result.ok) return result.value;
            reason = result.reason;
            await new Promise(resolve => setTimeout(resolve, 150));
        }
        throw new Error(reason);
    }
    async function run(cases, adapter, signal, report) {
        const results = cases.map(item => ({ name: item.name, status: 'pending', detail: '' }));
        report(results);
        for (let index = 0; index < cases.length; index++) {
            if (signal.aborted) break;
            const result = results[index];
            if (cases[index].skipReason) {
                result.status = 'skipped';
                result.detail = cases[index].skipReason;
                report(results);
                continue;
            }
            result.status = 'running';
            report(results);
            const started = Date.now();
            try {
                const details = await adapter(cases[index], signal);
                result.status = 'passed';
                result.detail = details || 'New bot response and all configured rendering checks passed.';
            } catch (error) {
                result.status = signal.aborted ? 'stopped' : 'failed';
                result.detail = error.message;
            }
            result.durationMs = Date.now() - started;
            report(results);
        }
        results.forEach(result => {
            if (result.status === 'pending') result.status = 'stopped';
        });
        report(results);
        return results;
    }
    async function sendTrigger(doc, trigger, signal) {
        const input = doc.querySelector('#mck-text-box');
        const send = doc.querySelector('#mck-msg-sbmt');
        if (!input || !send || !visible(input)) throw new Error('Widget composer is unavailable.');
        input.focus();
        input.textContent = trigger;
        if ('value' in input) input.value = trigger;
        input.dispatchEvent(new doc.defaultView.Event('input', { bubbles: true }));
        input.dispatchEvent(new doc.defaultView.KeyboardEvent('keyup', { bubbles: true }));
        // The widget disables Send for an empty composer. Wait after entering text.
        await waitFor(() => ({ ok: !send.disabled && visible(send), reason: 'Widget did not enable Send after entering the test message.' }), signal, 10000);
        send.click();
    }
    function validateActions(actions, doc) {
        if (!Array.isArray(actions)) throw new Error('actions must be an array.');
        actions.forEach(action => {
            if (!action || !['fill', 'select', 'check', 'reply', 'link', 'submit', 'invalidSubmit'].includes(action.type) ||
                typeof action.selector !== 'string' || !action.selector.trim() || typeof action.label !== 'string' || !action.label.trim()) {
                throw new Error('Each action needs a supported type, selector, and label.');
            }
            doc.querySelector(action.selector);
            if (['fill', 'select'].includes(action.type) && typeof action.value !== 'string') throw new Error('Field actions need a string value.');
            if (action.type === 'check' && typeof action.checked !== 'boolean') throw new Error('Check actions need checked: true or false.');
            if (action.type === 'reply' && (typeof action.expectedText !== 'string' || !action.expectedText.trim())) throw new Error('Reply actions need expectedText.');
            if (['submit', 'invalidSubmit', 'link'].includes(action.type) && (typeof action.url !== 'string' || !action.url.trim())) throw new Error('This action needs its expected URL.');
            if (action.type === 'link' && typeof action.target !== 'string') throw new Error('Link actions need their expected target.');
            if (action.type === 'submit' && (!action.expectedData || typeof action.expectedData !== 'object' || Array.isArray(action.expectedData))) throw new Error('Submit actions need expectedData.');
            if (action.type === 'invalidSubmit') {
                if (!action.errorSelector) throw new Error('Validation checks need errorSelector.');
                doc.querySelector(action.errorSelector);
            }
        });
    }
    function parseSubmission(body) {
        if (typeof body !== 'string') throw new Error('Unsupported submission body; expected JSON or URL-encoded fields.');
        try { return JSON.parse(body); } catch (error) {
            const result = {};
            new URLSearchParams(body).forEach((value, key) => {
                if (key.endsWith('[]')) {
                    key = key.slice(0, -2);
                    (result[key] || (result[key] = [])).push(value);
                } else result[key] = value;
            });
            return result;
        }
    }
    function verifySubmission(capture, expected) {
        if (capture.method !== 'POST') throw new Error('Expected a POST submission.');
        const data = parseSubmission(capture.body);
        for (const key of Object.keys(expected)) {
            if (JSON.stringify(data[key]) !== JSON.stringify(expected[key])) throw new Error('Submission field did not match: ' + key);
        }
    }
    async function captureSubmission(doc, message, button, action, signal) {
        const form = button.closest('form') || button.parentElement.querySelector('form');
        const url = new URL(action.url, doc.baseURI).href;
        if (!form || form.action !== url) throw new Error('Form endpoint differs from the configured test URL.');
        const requestType = button.getAttribute('data-requesttype');
        if (!['json', 'application/json'].includes(requestType) && !form.classList.contains('mck-actionable-form')) {
            throw new Error('Native form navigation is not supported by the submission capture.');
        }
        const prototype = doc.defaultView.XMLHttpRequest.prototype;
        const originalOpen = prototype.open;
        const originalSend = prototype.send;
        const requests = new WeakMap();
        const captures = [];
        prototype.open = function (method, requestUrl) {
            requests.set(this, { method: method.toUpperCase(), url: new URL(requestUrl, doc.baseURI).href });
            return originalOpen.apply(this, arguments);
        };
        prototype.send = function (body) {
            const request = requests.get(this);
            if (request && request.url === url) {
                captures.push({ ...request, body, xhr: this });
                return; // Capture only this form endpoint; chat API requests still run normally.
            }
            return originalSend.apply(this, arguments);
        };
        try {
            button.click();
            if (action.type === 'invalidSubmit') {
                await waitFor(() => ({ ok: Array.from(message.querySelectorAll(action.errorSelector)).some(visible), reason: 'Expected form validation error was not shown.' }), signal, 3000);
                if (captures.length) throw new Error('Invalid form attempted a submission.');
            } else {
                await waitFor(() => ({ ok: captures.length > 0, reason: 'Clicking Submit did not produce a request.' }), signal, 5000);
                if (captures.length !== 1) throw new Error('Submit produced duplicate requests.');
                verifySubmission(captures[0], action.expectedData);
            }
        } finally {
            prototype.open = originalOpen;
            prototype.send = originalSend;
            captures.forEach(capture => capture.xhr.abort());
        }
    }
    async function interact(doc, message, actions, signal) {
        const completed = [];
        for (const action of actions || []) {
            if (signal.aborted) throw new Error('Stopped by user');
            try {
                const element = contentRoots(message).flatMap(root => Array.from(root.querySelectorAll(action.selector))).find(visible);
                if (!element || element.disabled) throw new Error('Control is missing or disabled.');
                if (['fill', 'select'].includes(action.type)) {
                    element.focus();
                    element.value = action.value;
                    element.dispatchEvent(new doc.defaultView.Event('input', { bubbles: true }));
                    element.dispatchEvent(new doc.defaultView.Event('change', { bubbles: true }));
                    element.blur();
                    if (element.value !== action.value) throw new Error('Control did not retain the entered value.');
                } else if (action.type === 'check') {
                    if (element.checked !== action.checked) element.click();
                    if (element.checked !== action.checked) throw new Error('Selection did not change as expected.');
                } else if (action.type === 'reply') {
                    const before = new Set(doc.querySelectorAll('.mck-msg-right'));
                    element.click();
                    await waitFor(() => ({ ok: Array.from(doc.querySelectorAll('.mck-msg-right')).some(node => !before.has(node) && visible(node) && node.textContent.includes(action.expectedText)), reason: 'Click did not send the expected reply: ' + action.expectedText }), signal, 10000);
                } else if (action.type === 'link') {
                    const originalOpen = doc.defaultView.open;
                    const calls = [];
                    doc.defaultView.open = (url, target) => { calls.push({ url: String(url).trim(), target }); return null; };
                    try { element.click(); } finally { doc.defaultView.open = originalOpen; }
                    if (calls.length !== 1 || calls[0].url !== action.url || calls[0].target !== action.target) throw new Error('Link did not request the expected URL and target.');
                } else {
                    await captureSubmission(doc, message, element, action, signal);
                }
                completed.push(action.label);
            } catch (error) {
                throw new Error(action.label + ': ' + error.message + (completed.length ? ' Completed: ' + completed.join('; ') : ''));
            }
        }
        return completed;
    }
    const api = { allowed, validate, checkResponse, findResponse, waitFor, run, sendTrigger, openWidget, interact, validateActions, verifySubmission };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.RichMessageTests = api;
})(typeof window === 'undefined' ? globalThis : window);
