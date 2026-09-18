# Rich-message release checks

The test page lives at `example/demo2.html`; browser helpers and cases are in `example/rich-message-tests/`. This directory holds the local server, regression tests, and instructions. No Dashboard or Bot Server code changes are required. The hosted deployment has not been performed.

## One-time setup

### Run on localhost

From the Web SDK repository, run:

```sh
npm run serve:rich-messages
```

Open **http://127.0.0.1:8080/demo2.html** and click **Launch rich-message tests**. Your App ID and Bot ID are already filled in. Keep the terminal running; Ctrl+C stops the server. Do not double-click the HTML file: it needs HTTP to load its test cases.

On localhost the page loads the hosted `widget-test.kommunicate.io` bundle, which uses the test backend. Internet access is required. This tests the deployed test widget, not an unbuilt local SDK change. No `npm install` is needed for this page or its runner tests.

### Deploy on the widget test site

1. Run `npm run build-test` through the existing test deployment pipeline. The existing demo-page build step copies the page to `webplugin/build/demo2.html` and its three runtime assets to `webplugin/build/rich-message-tests/`. Only `NODE_ENV=test` includes these assets; regression tests and the local server are never deployed. The page uses the test build's `/kommunicate-widget-3.0.min.js`. Firebase cache rules disable caching for this page and its helpers. Other builds retain the existing demo page with the automation scripts removed. Allowed browser hosts are localhost, 127.0.0.1, test, and widget-test.kommunicate.io.
2. Cases are mapped to the supplied `ai-agent-bh0x4-k8yv4_1789712771810.json` export. No bot changes or retraining are required for this mapping. The export is configuration evidence; it does not confirm that the live bot responds successfully.
3. Keep `cases.json` synchronized when you change training phrases or rich payloads. Each case uses the exported trigger and response text, with CSS selectors checked against the SDK markup. The Suggested Replies intent has an introductory “Here w go” response; checks wait for its subsequent rich response, “Do you want more updates?”.
4. The page is preconfigured with test App ID `28012c5af21b3145d45399669c3fb799` and Bot ID `ai-agent-bh0x4-k8yv4`. Bot routing uses the SDK's `defaultBotIds` setting. You can change both fields. Choose Modern or Classic, and Float outside or Anchor inside preview. Disable pre-chat for unattended runs.
5. Click **Launch rich-message tests**. The page reloads with the selected configuration, opens the widget, sends the triggers in order, and lists each result. Repeat with the other layout for both layouts' coverage. Download the JSON report for release records.

## Exported cases

| Intent | Trigger | Status |
| --- | --- | --- |
| Buttons Rich message | `Buttons` | Rendering and interaction checks configured |
| Suggested Replies | `Suggested Replies` | Rendering and interaction checks configured |
| Link Buttons Rich message | `Link buttons` | Rendering and interaction checks configured |
| Submit Buttons | `My bill` | Rendering and interaction checks configured |
| List Template Rich message | `List template` | Rendering checks configured |
| Cards Rich message | `Cards` | Rendering checks configured |
| Card Carousel Rich msg | `Card Carousel` | Rendering and interaction checks configured |
| Videos & YouTube rich msg | `Videos & YouTube` | Rendering checks configured |
| HTML Rich message | `HTML` | Rendering checks configured |
| Form Template | `Form` | Rendering and interaction checks configured |
| Form dropdown | `Form dropdown` | Rendering and interaction checks configured |
| Form with Text Area | `Form text area` | Rendering and interaction checks configured |
| Autosuggestions in your chat box | `Where do you wanna go this summer?"` | Skipped: composer interaction needed |

The autosuggestion trigger contains a trailing double quote in the export; it is preserved exactly. That case is explicitly skipped and sends no message. Images, combined buttons, and date-picker intents are absent from this export and are not covered.

## Coverage and limits

There are 12 cases covering rendering and configured interactions, plus one explicitly skipped autosuggestion case. A pass requires a new visible incoming response containing the exported response text and all configured visible elements. HTML uses its rendered heading text inside the widget's open Shadow DOM. The YouTube URL check permits the widget's added query parameters while retaining the expected video ID. Card/list images must load successfully. Carousel checks require all three exported card titles; they do not verify carousel navigation. Old replies and ordinary fallback text cannot satisfy a case. Each case has a 30-second deadline; initialization has 45 seconds. A failed case does not prevent later cases running. Stop ends further sends; it cannot retract a message already sent.

The video case verifies a video element and the configured YouTube iframe, not playback. The export's other video URL is a Google Drive viewing page, whose presence does not establish playable media. Submit/form payloads include placeholder and external endpoints; this suite does not call them.

Configured actions also fill fields, toggle radio/checkbox choices, select dropdowns, click suggested replies, and verify invalid textarea input displays an error before submitting valid data. A case only passes when both rendering and every configured action pass. Results include completed action labels. Reply checks verify a new outgoing chat message; they do not assert a particular follow-up bot answer. These checks do not verify external endpoint responses, play video, compare screenshots, create/train bots, or validate dashboard editing. An iframe appearing is not proof that its video loaded. Avoid interacting with or resetting the widget while a run is active. See the live validation section below for the tested environment and result.

## Form and button interactions

The same Launch button runs the interaction steps in each case's optional `actions` array:

- Suggested replies and carousel replies: click and check a new outgoing message contains the configured reply.
- Link buttons: intercept `window.open` and check URL plus target (`_blank` or `_parent`) without leaving the test page.
- Submit button: click and check the captured POST contains its configured amount and description.
- Form Template: enter `Release QA` and a synthetic password, select Male, check Metal, check and uncheck Blues, submit, and verify fields in the captured payload.
- Form dropdown: select Engineer, enter a name, and verify the captured POST.
- Form with Text Area: enter an invalid review, click Submit and require a visible validation error with no submission; enter valid text and verify the subsequent POST.

Submissions to the configured sample URL are intercepted at the widget's XMLHttpRequest transport. No request is sent to that endpoint, and no successful server response is simulated. Other requests, including bot/chat messages and form acknowledgements, continue normally. Acknowledgements can contain synthetic form values in this test conversation. The interceptors are restored on success, failure, or cancellation. Results say **Submission payload captured (endpoint not contacted)**; this is not an end-to-end test of your form backend. Link navigation is similarly intercepted and reported explicitly.

Selectors are scoped to the new bot response. Each action needs `type`, `selector`, and `label`. Field entry uses `value`, checkboxes/radios use `checked`, replies use `expectedText`, links use `url` and `target`, and captured submissions use `url` and `expectedData`. Invalid-submit checks additionally use `errorSelector`. Use only synthetic test values. Keep the configured URL aligned with the payload; an unexpected form endpoint fails before clicking.

## Regression tests

```sh
npm run test:rich-messages
```

Uses Node's built-in assertions only. Covers automatic Chat selection on the modern Welcome screen, avoiding duplicate startup clicks, entering text before waiting for Send to enable, cancellation before sending, failure continuation, cancellation, timeout, host restrictions, configuration validation, HTML Shadow DOM content, explicit skips, stale messages, fallback replies, missing elements, and broken images. The interaction tests cover field events, checkbox toggles, missing controls, cancellation, link interception, POST serialization, invalid-submit rejection, and restoring transport hooks after errors. This does not replace a live browser run against the release widget and configured bot.

## Initial rendering validation — 2026-09-18

Verified in Chrome with Modern layout and Float outside placement, served from `127.0.0.1:8080` using the hosted test widget and the configured bot: **12 passed, 0 failed, 1 skipped**. Autosuggestions remain explicitly skipped. A repeat run with existing conversation history also reached the composer automatically. Classic layout was not verified in this run.

Startup now selects Chat from the modern Welcome screen, and enters text before waiting for Send to enable. HTML checks inspect the widget's open Shadow DOM; YouTube checks allow the SDK's added origin parameter. This initial run covered delivery and rendering. Interaction verification is described below.

## Interaction validation — 2026-09-18

The extended suite was exercised against the live test bot in Chrome, Modern layout, Float outside placement: **12 passed, 0 failed, 1 skipped**. Name/password entry, radio and checkbox choices, dropdown selection, textarea validation and correction, captured POST data, reply clicks, and intercepted link targets passed. The repeat-run startup check passed. Autosuggestions remain skipped; Classic layout and real external form backend responses were not verified. Both `runner.test.js` and `interactions.test.js` passed.

The regression command also checks the test-only build gate and emitted page/helper paths without requiring the SDK build dependencies. The complete SDK build still requires the repository dependencies.
