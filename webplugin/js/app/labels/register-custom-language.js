(function (globalScope) {
    if (!globalScope) {
        return;
    }
    var helpers = globalScope.KMLabelTranslationHelpers;
    if (!helpers) {
        return;
    }
    function getRuntimeGlobals() {
        return (
            (globalScope.applozic && globalScope.applozic._globals) ||
            (globalScope.kommunicate && globalScope.kommunicate._globals) ||
            null
        );
    }

    function getCustomLocales() {
        var runtimeGlobals = getRuntimeGlobals();
        var pluginSettings = globalScope.KM_PLUGIN_SETTINGS || runtimeGlobals || {};
        return (
            (pluginSettings && pluginSettings.customLabelLocales) ||
            (runtimeGlobals && runtimeGlobals.customLabelLocales) ||
            null
        );
    }

    function registerLocales(locales) {
        if (!locales || typeof locales !== 'object') {
            return false;
        }
        Object.keys(locales).forEach(function (locale) {
            helpers.registerLocale(locale, locales[locale]);
        });
        return true;
    }

    function tryRegister(attempts) {
        var customLocales = getCustomLocales();
        if (registerLocales(customLocales)) {
            return;
        }
        if (attempts <= 0) {
            return;
        }
        setTimeout(function () {
            tryRegister(attempts - 1);
        }, 50);
    }

    tryRegister(6);
})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);
