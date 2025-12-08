(function (globalScope) {
    if (!globalScope) {
        return;
    }
    var helper = globalScope.KMLabelTranslationHelpers;
    if (!helper) {
        return;
    }
    var languages = ['ru', 'ja', 'ko'];
    languages.forEach(function (lang) {
        helper.registerLanguage(lang);
    });
})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);
