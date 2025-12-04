(function (globalScope) {
    if (!globalScope) {
        return;
    }
    var helper = globalScope.KMLabelTranslationHelpers;
    if (!helper) {
        return;
    }
    var languages = ['fr', 'de', 'pt', 'it', 'ru', 'ja', 'ko', 'zh'];
    languages.forEach(function (lang) {
        helper.registerLanguage(lang);
    });
})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);
