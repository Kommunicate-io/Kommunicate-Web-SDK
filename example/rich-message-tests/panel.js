(function () {
    'use strict';
    const runner = window.RichMessageTests;
    if (!runner.allowed(location.hostname)) return;
    const panel = document.createElement('section');
    panel.className = 'rich-test-panel';
    panel.setAttribute('aria-labelledby', 'rich-heading');
    panel.innerHTML = `
        <style>
            main.rich-test-layout { grid-template-columns: minmax(340px, 400px) minmax(0, 1fr); align-items: start; }
            .rich-test-layout > .preview-panel { position: sticky; top: 24px; }
            .rich-test-panel { margin: 20px 0; padding: 18px; border: 1px solid #dbe2f0; border-radius: 14px; background: #f8fafc; }
            .rich-test-panel h2 { font-size: 18px; margin: 0 0 8px; }
            .rich-test-panel p { font-size: 13px; line-height: 1.5; }
            .rich-test-panel .actions { gap: 8px; }
            .rich-test-panel .actions button { padding: 10px 14px; font-size: 13px; }
            .rich-test-panel #rich-launch { width: 100%; }
            .rich-test-panel .actions button:not(#rich-launch) { background: #e2e8f0; color: #0f172a; }
            .rich-test-panel .actions button:disabled { opacity: .45; cursor: not-allowed; }
            .rich-test-panel :is(button, summary, textarea):focus-visible { outline: 2px solid #2563eb; outline-offset: 3px; }
            .rich-test-panel details { margin-top: 14px; }
            .rich-test-panel summary { font-size: 13px; }
            .rich-test-panel summary::after { content: '+'; }
            .rich-test-panel details[open] > summary::after { content: '−'; }
            .rich-test-panel label { display: block; margin: 12px 0 6px; font-size: 12px; }
            .rich-test-panel textarea { font-family: Consolas, monospace; font-size: 12px; }
            .rich-test-panel #rich-status { margin: 14px 0 0; padding: 10px; border-radius: 8px; background: #eef2ff; color: #1f3e8a; overflow-wrap: anywhere; }
            .rich-test-panel #rich-results { list-style: none; padding: 0; margin: 12px 0 0; max-height: 420px; overflow-y: auto; }
            .rich-test-panel #rich-results:empty { display: none; }
            .rich-test-panel .rich-result { padding: 10px; margin-bottom: 8px; border: 1px solid #dbe2f0; border-left: 3px solid #94a3b8; border-radius: 8px; background: white; overflow-wrap: anywhere; }
            .rich-test-panel .rich-result[data-status="failed"] { border-left-color: #b91c1c; }
            .rich-test-panel .rich-result[data-status="passed"] { border-left-color: #15803d; }
            .rich-test-panel .rich-result[data-status="running"] { border-left-color: #2563eb; }
            .rich-test-panel .rich-result strong { display: block; font-size: 13px; margin: 5px 0; }
            .rich-test-panel .rich-result span { font-size: 11px; font-weight: 700; color: #475569; }
            .rich-test-panel .rich-result[data-status="failed"] span { color: #991b1b; }
            .rich-test-panel .rich-result[data-status="passed"] span { color: #166534; }
            .rich-test-panel .rich-result p { margin: 0; font-size: 12px; }
            @media (max-width: 800px) {
                main.rich-test-layout { grid-template-columns: minmax(0, 1fr); }
                .rich-test-layout > .preview-panel { position: static; }
            }
        </style>
        <h2 id="rich-heading">Rich-message tests</h2>
        <p>Check messages, buttons and forms with your test bot. Use the App ID and Bot ID in the settings below.</p>
        <div class="actions">
          <button id="rich-launch" type="button">Launch rich-message tests</button>
          <button id="rich-stop" type="button" disabled>Stop</button>
          <button id="rich-download" type="button" disabled>Download report</button>
        </div>
        <p id="rich-status" role="status" aria-live="polite">Loading test cases…</p>
        <ol id="rich-results" aria-label="Test results"></ol>
        <details>
          <summary>Test cases & coverage</summary>
          <p>Checks send real chat messages, fill fields with synthetic data, and click controls. Form payloads are captured locally and link navigation is intercepted. External endpoint responses and video playback are not tested. Unsupported checks are skipped.</p>
          <label for="rich-cases">Edit test cases (JSON)</label>
          <textarea id="rich-cases" rows="10" spellcheck="false"></textarea>
        </details>`;
    document.querySelector('main').classList.add('rich-test-layout');
    document.getElementById('widget-config-form').before(panel);
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
            row.className = 'rich-result';
            row.dataset.status = result.status;
            const badge = document.createElement('span');
            badge.textContent = result.status.toUpperCase();
            const name = document.createElement('strong');
            name.textContent = result.name;
            const detail = document.createElement('p');
            detail.textContent = result.detail;
            row.append(badge, name, detail);
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
