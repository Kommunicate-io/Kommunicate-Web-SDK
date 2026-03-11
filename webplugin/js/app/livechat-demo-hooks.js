var KMLivechatDemoHooks = (function () {
    'use strict';

    function applySettings(settings) {
        if (!settings || typeof settings !== 'object') {
            return;
        }
        settings.isLivechatDemo = true;
        if (typeof settings.onAuthFailure !== 'function') {
            settings.onAuthFailure = function (payload) {
                try {
                    if (
                        typeof window === 'undefined' ||
                        !window.parent ||
                        window.parent === window
                    ) {
                        return;
                    }
                    window.parent.postMessage(payload, '*');
                } catch (error) {}
            };
        }
    }

    return {
        applySettings: applySettings,
    };
})();
