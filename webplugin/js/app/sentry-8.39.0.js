const KM_SENTRY_CONFIG = {
    dsn: MCK_THIRD_PARTY_INTEGRATION.sentry.dsn,
    debug: false,
    tracesSampleRate: 1,
    replaysSessionSampleRate: 0.0,
    replaysOnErrorSampleRate: 1,
    release: MCK_ENV_DETAILS.BRANCH,
    environment: MCK_ENV_DETAILS.ENVIRONMENT,
    // allowUrls: ['(https|wss)?://([a-zA-Z0-9-]+.)?kommunicate.io'],
    ignoreErrors: [
        // Ignore errors with specific messages or patterns
        'Non-Error exception captured with keys: currentTarget',
    ],
    /**
     * If there any error occurs on the start of the widget then it's easy to debug like who is the user
     * previously it's not attach
     */
    initialScope: (scope) => {
        Sentry &&
            Sentry.setTags({
                url: parent.window.location.href,
                applicationId: applozic._globals.appId,
            });
        return scope;
    },
    /**
     * Before send the event to the sentry server we can modify the event here
     */
    beforeSend: function (event, hint) {
        // console.error('event: ', event);
        // console.error('hint: ', hint);
        return event;
    },
};

const KM_REPLAY_CONFIG = {
    maskAllText: false,
    blockAllMedia: false,
    maskAllInputs: true,
};

(function sentryLoader(
    _window,
    _document,
    _errorEvent,
    _unhandledrejectionEvent,
    _namespace,
    _publicKey,
    _sdkBundleUrl,
    _loaderInitConfig,
    _lazy
) {
    var lazy = _lazy;
    for (var i = 0; i < document.scripts.length; i++) {
        if (document.scripts[i].src.indexOf(_publicKey) > -1) {
            // If lazy was set to true above, we need to check if the user has set data-lazy="no"
            // to confirm that we should lazy load the CDN bundle
            if (lazy && document.scripts[i].getAttribute('data-lazy') === 'no') {
                lazy = false;
            }
            break;
        }
    }
    var onLoadCallbacks = [];
    function queueIsError(item) {
        return 'e' in item;
    }
    function queueIsPromiseRejection(item) {
        return 'p' in item;
    }
    function queueIsFunction(item) {
        return 'f' in item;
    }
    var queue = [];
    // Create a namespace and attach function that will store captured exception
    // Because functions are also objects, we can attach the queue itself straight to it and save some bytes
    function enqueue(item) {
        if (
            lazy &&
            (queueIsError(item) ||
                queueIsPromiseRejection(item) ||
                (queueIsFunction(item) && item.f.indexOf('capture') > -1) ||
                (queueIsFunction(item) && item.f.indexOf('showReportDialog') > -1))
        ) {
            // We only want to lazy inject/load the sdk bundle if
            // an error or promise rejection occured
            // OR someone called `capture...` on the SDK
            injectCDNScriptTag();
        }
        queue.push(item);
    }
    function onError() {
        // Use keys as "data type" to save some characters"
        enqueue({
            e: [].slice.call(arguments),
        });
    }
    function onUnhandledRejection(p) {
        enqueue({
            p: p,
        });
    }
    function onSentryCDNScriptLoaded() {
        try {
            // Add loader as SDK source
            _window.SENTRY_SDK_SOURCE = 'loader';
            var SDK_1 = _window[_namespace];
            var cdnInit_1 = SDK_1.init;
            // Configure it using provided DSN and config object
            SDK_1.init = function (options) {
                // Remove the lazy mode error event listeners that we previously registered
                // Once we call init, we can assume that Sentry has added it's own global error listeners
                _window.removeEventListener(_errorEvent, onError);
                _window.removeEventListener(_unhandledrejectionEvent, onUnhandledRejection);
                var mergedInitOptions = _loaderInitConfig;
                for (var key in options) {
                    if (Object.prototype.hasOwnProperty.call(options, key)) {
                        mergedInitOptions[key] = options[key];
                    }
                }
                setupDefaultIntegrations(mergedInitOptions, SDK_1);
                cdnInit_1(mergedInitOptions);
            };
            // Wait a tick to ensure that all `Sentry.onLoad()` callbacks have been registered
            setTimeout(function () {
                return setupSDK(SDK_1);
            });
        } catch (o_O) {
            console.error(o_O);
        }
    }
    var injectedCDNScriptTag = false;
    /**
     * Injects script tag into the page pointing to the CDN bundle.
     */
    function injectCDNScriptTag() {
        if (injectedCDNScriptTag) {
            return;
        }
        injectedCDNScriptTag = true;
        // Create a `script` tag with provided SDK `url` and attach it just before the first, already existing `script` tag
        // Scripts that are dynamically created and added to the document are async by default,
        // they don't block rendering and execute as soon as they download, meaning they could
        // come out in the wrong order. Because of that we don't need async=1 as GA does.
        // it was probably(?) a legacy behavior that they left to not modify few years old snippet
        // https://www.html5rocks.com/en/tutorials/speed/script-loading/
        var firstScriptTagInDom = _document.scripts[0];
        var cdnScriptTag = _document.createElement('script');
        cdnScriptTag.src = _sdkBundleUrl;
        cdnScriptTag.crossOrigin = 'anonymous';
        // Once our SDK is loaded
        cdnScriptTag.addEventListener('load', onSentryCDNScriptLoaded, {
            once: true,
            passive: true,
        });
        firstScriptTagInDom.parentNode.insertBefore(cdnScriptTag, firstScriptTagInDom);
    }
    // We want to ensure to only add default integrations if they haven't been added by the user.
    function setupDefaultIntegrations(config, SDK) {
        var integrations = config.integrations || [];
        // integrations can be a function, in which case we will not add any defaults
        if (!Array.isArray(integrations)) {
            return;
        }
        var integrationNames = integrations.map(function (integration) {
            return integration.name;
        });
        // Add necessary integrations based on config
        if (config.tracesSampleRate && integrationNames.indexOf('BrowserTracing') === -1) {
            if (SDK.browserTracingIntegration) {
                // (Post-)v8 version of the BrowserTracing integration
                integrations.push(SDK.browserTracingIntegration({ enableInp: true }));
            } else if (SDK.BrowserTracing) {
                // Pre v8 version of the BrowserTracing integration
                integrations.push(new SDK.BrowserTracing());
            }
        }
        if (
            (config.replaysSessionSampleRate || config.replaysOnErrorSampleRate) &&
            integrationNames.indexOf('Replay') === -1
        ) {
            if (SDK.replayIntegration) {
                // (Post-)v8 version of the Replay integration
                integrations.push(SDK.replayIntegration(KM_REPLAY_CONFIG));
            } else if (SDK.Replay) {
                // Pre v8 version of the Replay integration
                integrations.push(new SDK.Replay(KM_REPLAY_CONFIG));
            }
        }
        config.integrations = integrations;
    }
    function sdkIsLoaded() {
        var __sentry = _window.__SENTRY__;
        // If this is set, it means a v8 SDK is already loaded
        var version = typeof __sentry !== 'undefined' && __sentry.version;
        if (version) {
            return !!__sentry[version];
        }
        // If there is a global __SENTRY__ that means that in any of the callbacks init() was already invoked
        return !!(!(typeof __sentry === 'undefined') && __sentry.hub && __sentry.hub.getClient());
    }
    function setupSDK(SDK) {
        try {
            // If defined, we call window.sentryOnLoad first
            if (typeof _window.sentryOnLoad === 'function') {
                _window.sentryOnLoad();
                // Cleanup to allow garbage collection
                _window.sentryOnLoad = undefined;
            }
        } catch (o_O) {
            console.error('Error while calling `sentryOnLoad` handler:');
            console.error(o_O);
        }
        try {
            // We have to make sure to call all callbacks first
            for (var i = 0; i < onLoadCallbacks.length; i++) {
                if (typeof onLoadCallbacks[i] === 'function') {
                    onLoadCallbacks[i]();
                }
            }
            // Cleanup to allow garbage collection
            onLoadCallbacks.splice(0);
            // First call all inits from the queue
            for (var i = 0; i < queue.length; i++) {
                var item = queue[i];
                if (queueIsFunction(item) && item.f === 'init') {
                    SDK.init.apply(SDK, item.a);
                }
            }
            // If the SDK has not been called manually, either in an onLoad callback, or somewhere else,
            // we initialize it for the user
            if (!sdkIsLoaded()) {
                SDK.init();
            }
            // Now, we _know_ that the SDK is initialized, and can continue with the rest of the queue
            // Because we installed the SDK, at this point we can assume that the global handlers have been patched
            // which can take care of browser differences (eg. missing exception argument in onerror)
            var sentryPatchedErrorHandler = _window.onerror;
            var sentryPatchedUnhandledRejectionHandler = _window.onunhandledrejection;
            for (var i = 0; i < queue.length; i++) {
                var item = queue[i];
                if (queueIsFunction(item)) {
                    // We already called all init before, so just skip this
                    if (item.f === 'init') {
                        continue;
                    }
                    SDK[item.f].apply(SDK, item.a);
                } else if (queueIsError(item) && sentryPatchedErrorHandler) {
                    sentryPatchedErrorHandler.apply(_window, item.e);
                } else if (
                    queueIsPromiseRejection(item) &&
                    sentryPatchedUnhandledRejectionHandler
                ) {
                    sentryPatchedUnhandledRejectionHandler.apply(_window, [item.p]);
                }
            }
        } catch (o_O) {
            console.error(o_O);
        }
    }
    // We make sure we do not overwrite window.Sentry since there could be already integrations in there
    _window[_namespace] = _window[_namespace] || {};
    _window[_namespace].onLoad = function (callback) {
        // If the SDK was already loaded, call the callback immediately
        if (sdkIsLoaded()) {
            callback();
            return;
        }
        onLoadCallbacks.push(callback);
    };
    _window[_namespace].forceLoad = function () {
        setTimeout(function () {
            injectCDNScriptTag();
        });
    };
    [
        'init',
        'addBreadcrumb',
        'captureMessage',
        'captureException',
        'captureEvent',
        'configureScope',
        'withScope',
        'showReportDialog',
    ].forEach(function (f) {
        _window[_namespace][f] = function () {
            enqueue({ f: f, a: arguments });
        };
    });
    _window.addEventListener(_errorEvent, onError);
    _window.addEventListener(_unhandledrejectionEvent, onUnhandledRejection);
    if (!lazy) {
        setTimeout(function () {
            injectCDNScriptTag();
        });
    }
})(
    window,
    document,
    'error',
    'unhandledrejection',
    'Sentry',
    MCK_THIRD_PARTY_INTEGRATION.sentry.nameSpace,
    'https://browser.sentry-cdn.com/8.39.0/bundle.tracing.replay.debug.min.js',
    KM_SENTRY_CONFIG,
    false
);
// /https?:\/\/((cdn|www|chat(-[a-zA-Z0-9]+)?|api(-[a-zA-Z0-9]+)?)\.)?kommunicate\.io/
