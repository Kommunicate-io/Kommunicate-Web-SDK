(function () {
    'use strict';
    const runner = window.RichMessageTests;
    if (!runner.allowed(location.hostname)) return;
    const panel = document.createElement('section');
    panel.className = 'panel';
    panel.innerHTML = `
        <h2>Rich-message release checks</h2>
        <p>Use a dedicated test app and trained bot. Checks send real chat messages and verify new bot responses in the selected widget layout.</p>
        <p>Cases are matched to your exported bot. Set App ID and Bot ID above, then launch. Missing automation is reported as skipped.</p>
        <label for="rich-cases">Test cases (JSON)</label>
        <textarea id="rich-cases" rows="12" spellcheck="false"></textarea>
        <p>Checks render messages, fill forms, and click configured controls. Form payloads are captured locally and link navigation is intercepted. External endpoints and video playback are not tested. Form values are synthetic test data.</p>
        <div class="actions">
          <button id="rich-launch" type="button">Launch rich-message tests</button>
          <button id="rich-stop" type="button" disabled>Stop</button>
          <button id="rich-download" type="button" disabled>Download report</button>
        </div>
        <p id="rich-status" role="status" aria-live="polite">Loading test cases…</p>
        <ol id="rich-results"></ol>`;
    document.querySelector('main').appendChild(panel);
    const editor = panel.querySelector('#rich-cases');
    const launch = panel.querySelector('#rich-launch');
    const stop = panel.querySelector('#rich-stop');
    const download = panel.querySelector('#rich-download');
    const status = panel.querySelector('#rich-status');
    const list = panel.querySelector('#rich-results');
    const pendingKey = 'km-rich-tests-pending';
    let controller;
    let report;
    launch.disabled = true;
    function render(results) {
        report.results = results;
        list.replaceChildren();
        results.forEach(result => {
            const row = document.createElement('li');
            row.textContent = `${result.status.toUpperCase()} — ${result.name}${result.detail ? ': ' + result.detail : ''}`;
            row.style.color = result.status === 'failed' ? '#991b1b' : result.status === 'passed' ? '#166534' : '#475569';
            list.appendChild(row);
        });
    }
    function widgetDocument() {
        const frame = document.querySelector('iframe[name="Kommunicate widget iframe"]');
        if (!frame) return null;
        try {
            return frame.contentDocument;
        } catch (error) {
            throw new Error('Widget iframe is cross-origin. Run this page from the Web SDK test host.');
        }
    }
    async function execute(cases) {
        controller = new AbortController();
        launch.disabled = true;
        stop.disabled = false;
        download.disabled = true;
        editor.disabled = true;
        report = { startedAt: new Date().toISOString(), appId: document.getElementById('appId').value,
            botId: document.getElementById('agentId').value,
            layout: document.querySelector('input[name="layout"]:checked').value,
            scope: 'Rendering, field entry, reply clicks, validation, captured submission payloads and intercepted link targets. External endpoint responses and media playback are not tested.', results: [] };
        status.textContent = 'Waiting for widget initialization…';
        try {
            const startup = {};
            const doc = await runner.waitFor(() => {
                const doc = widgetDocument();
                return { ok: runner.openWidget(doc, startup), value: doc,
                    reason: 'Widget composer unavailable. Check App ID, complete pre-chat, and open a bot conversation.' };
            }, controller.signal, 45000);
            status.textContent = 'Running rich-message checks…';
            await runner.run(cases, async (item, signal) => {
                if (widgetDocument() !== doc) throw new Error('Widget reloaded during the run. Launch again.');
                const before = new Set(doc.querySelectorAll('.mck-msg-left'));
                await runner.sendTrigger(doc, item.trigger, signal);
                await runner.waitFor(() => {
                    const reason = runner.checkResponse(doc, before, item);
                    return { ok: !reason, reason };
                }, signal);
                const steps = await runner.interact(doc, runner.findResponse(doc, before, item), item.actions, signal);
                return steps.length ? 'Rendering passed. ' + steps.join('; ') + '.' : 'Rendering passed (no interaction checks configured).';
            }, controller.signal, render);
            const failed = report.results.filter(result => result.status === 'failed').length;
            const passed = report.results.filter(result => result.status === 'passed').length;
            const skipped = report.results.filter(result => result.status === 'skipped').length;
            status.textContent = `${controller.signal.aborted ? 'Stopped' : 'Finished'}: ${passed} passed, ${failed} failed, ${skipped} skipped, ${report.results.length - passed - failed - skipped} stopped.`;
        } catch (error) {
            report.error = error.message;
            render(cases.map(item => ({ name: item.name, status: controller.signal.aborted ? 'stopped' : 'blocked', detail: error.message })));
            status.textContent = error.message;
        } finally {
            report.finishedAt = new Date().toISOString();
            launch.disabled = false;
            stop.disabled = true;
            download.disabled = false;
            editor.disabled = false;
        }
    }
    launch.addEventListener('click', () => {
        try {
            const cases = runner.validate(JSON.parse(editor.value), document);
            const appId = document.getElementById('appId').value.trim();
            if (!appId || appId === 'kommunicate-support' || !document.getElementById('agentId').value.trim()) {
                throw new Error('Enter your dedicated test App ID and Bot ID first.');
            }
            if (document.querySelector('input[name="containerMode"]:checked').value === 'iframe') {
                throw new Error('Select Float outside or Anchor inside preview for these checks.');
            }
            // Validate configuration before persisting the one-shot run across the page reload.
            buildLaunchConfig();
            sessionStorage.setItem(pendingKey, JSON.stringify(cases));
            document.getElementById('widget-config-form').requestSubmit();
        } catch (error) {
            sessionStorage.removeItem(pendingKey);
            status.textContent = error.message;
        }
    });
    stop.addEventListener('click', () => controller.abort());
    download.addEventListener('click', () => {
        const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' }));
        const link = document.createElement('a');
        link.href = url;
        link.download = 'rich-message-results.json';
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
    async function init() {
        try {
            const pending = sessionStorage.getItem(pendingKey);
            sessionStorage.removeItem(pendingKey);
            let cases;
            if (pending) cases = JSON.parse(pending);
            else {
                const response = await fetch('./rich-message-tests/cases.json');
                if (!response.ok) throw new Error('Unable to load cases.json');
                cases = await response.json();
            }
            runner.validate(cases, document);
            editor.value = JSON.stringify(cases, null, 2);
            launch.disabled = false;
            status.textContent = 'Ready. Configure your test app and bot, then launch.';
            if (pending) await execute(cases);
        } catch (error) {
            status.textContent = error.message;
        }
    }
    init();
})();
