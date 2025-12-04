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
            assignNested(labels, path, overrides[path]);
        });
    }

    var helpers = {
        registerEnglishLabels: function (labels) {
            if (!labels) {
                return;
            }
            KM_LABELS_LANGUAGES.en = deepClone(labels);
        },
        registerLanguage: function (locale, overrides) {
            if (!locale || locale === 'en') {
                return;
            }
            var base = KM_LABELS_LANGUAGES.en;
            if (!base) {
                return;
            }
            var labels = deepClone(base);
            if (overrides) {
                applyOverrides(labels, overrides);
            }
            KM_LABELS_LANGUAGES[locale] = labels;
        },
    };
    globalScope.KMLabelTranslationHelpers = helpers;
})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);
