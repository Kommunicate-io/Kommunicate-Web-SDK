# Google Maps API Key Remediation

This checklist tracks remediation for the vulnerable Google Maps browser API key reported under CWE-798.

## Important security model

The Maps JavaScript API runs in the browser, so its API key is necessarily visible to users. The key must not be treated as a secret. The security control is Google Cloud restriction by HTTP referrer, allowed APIs, quotas, and billing alerts.

Do not commit a server-side Google credential or unrestricted API key to this repository.

## 1. Identify the affected key and usage

-   [ ] Record the affected key by its last four characters only. Do not paste the full key into tickets, commits, or this document.
-   [ ] Confirm all browser usages in the Dashboard and Web SDK:
    -   Maps JavaScript API script loading
    -   Places autocomplete
    -   Browser geocoding/reverse geocoding
    -   Static Maps image requests
-   [ ] Search source and generated assets for Google API key literals:

    ```bash
    rg -n --hidden -S "AIza[0-9A-Za-z_-]{20,}|maps/api/js|staticmap|googleAPIKeys|mapStaticAPIkey" .
    ```

## 2. Create or select the Google Cloud browser key

-   [ ] Select the Google Cloud project that owns the production Maps billing account.
-   [ ] Enable only the Maps services required by the application.
-   [ ] Create a dedicated browser key for the Dashboard/Web SDK. Do not reuse Gemini, server, or service-account credentials.
-   [ ] Configure **Application restrictions** as **Websites / HTTP referrers**.
-   [ ] Add exact production origins and paths, for example:

    ```text
    https://dashboard.kommunicate.io/*
    ```

    Add other approved production origins only when the SDK genuinely runs there. Do not use `*`.

-   [ ] Configure **API restrictions** and allow only the APIs required by the implementation:
    -   Maps JavaScript API
    -   Places API, if Places autocomplete is used
    -   Maps Static API, if Static Maps images are used
    -   Add another API only after confirming a failed legitimate request requires it.
-   [ ] Configure per-API quotas appropriate for expected traffic.
-   [ ] Configure billing budget and usage alerts.
-   [ ] Save the key securely. Never add it to this README or source-control history.

## 3. Rotate the old key

-   [ ] Deploy the new restricted key first.
-   [ ] Confirm production Maps functionality works with the new key.
-   [ ] Review Google Cloud metrics for unexpected usage.
-   [ ] Disable or delete the old exposed key only after the new deployment is verified.
-   [ ] If the old key cannot be located, document that fact and continue removing all old literals from source and generated assets.

## 4. Remove hardcoded SDK fallbacks

The SDK currently contains hardcoded browser-key fallbacks in `webplugin/js/app/mck-app.js` and `webplugin/js/app/mck-sidebox-1.0.js`.

-   [ ] Replace duplicated literals with one SDK configuration value supplied during initialization/build.
-   [ ] Do not add another fallback literal.
-   [ ] Preserve existing behavior when the configured key is present.
-   [ ] When the key is missing, disable Maps features or show a clear configuration error; do not silently use an unrestricted key.
-   [ ] Keep the Dashboard environment configuration as the deployment source of the value, while ensuring the SDK receives it through the existing configuration path.
-   [ ] Do not log the key.

Example configuration shape (adapt to the existing SDK API; do not introduce a second configuration system):

```js
Kommunicate.init({
    googleMapsApiKey: process.env.GOOGLE_MAPS_BROWSER_API_KEY,
});
```

The value will still be visible in browser assets. That is expected; Google Cloud restrictions are mandatory.

## 5. Build and verify locally

-   [ ] Build the Web SDK using the repository's documented build command.
-   [ ] Build the Dashboard using its documented build command.
-   [ ] Search source and build output for the old key and any duplicate key literals:

    ```bash
    rg -n --hidden -S "AIza[0-9A-Za-z_-]{20,}" . --glob '!node_modules' --glob '!*.map'
    ```

-   [ ] Confirm no unrestricted fallback remains in `mck-app.js`, `mck-sidebox-1.0.js`, or other distributable assets.
-   [ ] Confirm the new key appears only where browser configuration requires it.
-   [ ] Confirm no server-side credentials were copied into the SDK.

## 6. Test in a deployed environment

-   [ ] Open the production Dashboard and verify the Maps JavaScript request succeeds.
-   [ ] Verify Places autocomplete, map rendering, geocoding, and Static Maps images as applicable.
-   [ ] In browser DevTools → Network, inspect `maps/api/js` and `staticmap` requests.
-   [ ] Confirm requests use the new key, not the old key.
-   [ ] Test an unapproved origin in a controlled non-production environment and confirm Google rejects the request.
-   [ ] Check Google Cloud metrics and error reports after deployment.

## 7. Evidence for security closure

Attach or record the following without exposing the full key:

-   [ ] Google Cloud project name and key name.
-   [ ] Key suffix only.
-   [ ] Screenshot/export showing HTTP referrer restrictions.
-   [ ] Screenshot/export showing API restrictions.
-   [ ] Quota and billing-alert configuration.
-   [ ] Deployment version/commit containing the remediation.
-   [ ] Search result proving the old key is absent from source and generated assets.
-   [ ] Browser Network evidence showing the new key is used.
-   [ ] Google Cloud metrics showing expected usage only.

## Completion criteria

The issue is ready to close only when the old key is disabled or confirmed deleted, the replacement key is restricted by exact referrers and required APIs, generated assets contain no old key, and production functionality has been verified.
