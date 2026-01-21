(function (globalScope) {
    if (!globalScope) {
        return;
    }
    var KM_LABELS_LANGUAGES = globalScope.KM_LABELS_LANGUAGES || {};
    globalScope.KM_LABELS_LANGUAGES = KM_LABELS_LANGUAGES;

    function deepClone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function assignNested(target, path, value) {
        var parts = path.split('.');
        var lastKey = parts.pop();
        var current = target;
        for (var i = 0; i < parts.length; i++) {
            var key = parts[i];
            if (!current[key] || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }
        current[lastKey] = value;
    }

    function applyOverrides(labels, overrides) {
        Object.keys(overrides || {}).forEach(function (path) {
            labels[path] = overrides[path];
            assignNested(labels, path, overrides[path]);
        });
    }

    function buildLocale(base, overrides) {
        if (!base) {
            return null;
        }
        var cloned = deepClone(base);
        if (overrides) {
            applyOverrides(cloned, overrides);
        }
        return cloned;
    }

    function applyLocale(locale, overrides) {
        var source = KM_LABELS_LANGUAGES[locale] || KM_LABELS_LANGUAGES.en;
        var labels = buildLocale(source, overrides);
        if (labels) {
            KM_LABELS_LANGUAGES[locale] = labels;
            return true;
        }
        return false;
    }

    function processPendingOverrides() {
        Object.keys(pendingLocaleOverrides).forEach(function (locale) {
            var overrides = pendingLocaleOverrides[locale];
            if (applyLocale(locale, overrides)) {
                delete pendingLocaleOverrides[locale];
            }
        });
    }

    var pendingLocaleOverrides = {};
    function registerLocaleInternal(locale, overrides) {
        if (!locale) {
            return;
        }
        if (overrides === null || overrides === undefined) {
            overrides = {};
        }
        if (applyLocale(locale, overrides)) {
            delete pendingLocaleOverrides[locale];
            return;
        }
        pendingLocaleOverrides[locale] = overrides;
    }

    var helpers = {
        registerEnglishLabels: function (labels) {
            if (!labels) {
                return;
            }
            KM_LABELS_LANGUAGES.en = deepClone(labels);
            processPendingOverrides();
        },
        registerLanguage: function (locale, overrides) {
            if (!locale || locale === 'en') {
                return;
            }
            registerLocaleInternal(locale, overrides);
        },
        registerLocale: registerLocaleInternal,
    };
    globalScope.KMLabelTranslationHelpers = helpers;
})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);
