const fs = require('fs');
const path = require('path');

const labelsDir = path.join('webplugin', 'js', 'app', 'labels');
const localeDir = path.join(labelsDir, 'locales');
const outputFile = path.join(labelsDir, 'generated-labels-locales.js');

function getLocaleList() {
    return fs
        .readdirSync(localeDir)
        .filter(function (name) {
            return name.endsWith('.json');
        })
        .map(function (name) {
            return name.replace('.json', '');
        })
        .sort();
}

function build() {
    if (!fs.existsSync(localeDir)) {
        throw new Error('Locale directory does not exist: ' + localeDir);
    }
    const locales = {};
    getLocaleList().forEach(function (locale) {
        const filePath = path.join(localeDir, locale + '.json');
        const raw = fs.readFileSync(filePath, 'utf8');
        locales[locale] = JSON.parse(raw);
    });

    const content = [
        '(function (globalScope) {',
        '    if (!globalScope) {',
        '        return;',
        '    }',
        '    var helpers = globalScope.KMLabelTranslationHelpers;',
        '    if (!helpers) {',
        '        return;',
        '    }',
        '    var locales = ' + JSON.stringify(locales, null, 4) + ';',
        '    Object.keys(locales).forEach(function (locale) {',
        '        helpers.registerLanguage(locale, locales[locale]);',
        '    });',
        "})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);",
    ].join('\n');

    fs.writeFileSync(outputFile, content);
}

try {
    build();
} catch (err) {
    console.error(err);
    process.exit(1);
}
