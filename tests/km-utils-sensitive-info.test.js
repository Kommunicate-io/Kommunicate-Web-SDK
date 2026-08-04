const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function loadKommunicateUtils(cardValidator) {
    const source = fs.readFileSync(
        path.join(__dirname, '..', 'webplugin', 'js', 'app', 'km-utils.js'),
        'utf8'
    );
    const sandbox = {
        console,
        kommunicate: { _globals: {}, PRODUCT_ID: 'kommunicate' },
        window: { location: { origin: 'http://localhost' } },
        document: {},
        navigator: { language: 'en-US', userAgent: '', appVersion: '' },
        URL,
        Set,
        JSON,
        Math,
        Date,
        Promise,
        KMCardValidator: cardValidator,
        setTimeout,
        clearTimeout,
        setInterval,
        clearInterval,
    };

    vm.createContext(sandbox);
    vm.runInContext(source, sandbox, { timeout: 1000 });

    return sandbox.KommunicateUtils;
}

test('preserves literal token-like text and replacement sequences inside URLs', () => {
    const KommunicateUtils = loadKommunicateUtils({
        number(candidate) {
            const normalizedCandidate = candidate.replace(/[^\d]/g, '');
            const isCardCandidate = normalizedCandidate === '4242424242424242';

            return {
                isValid: isCardCandidate,
                isPotentiallyValid: isCardCandidate,
            };
        },
    });
    const settings = {
        maskCards: true,
    };
    const message =
        'Literal __KM_URL_TOKEN_0__ before https://example.test/$1/4242-4242-4242-4242.png and card 4242 4242 4242 4242';

    const sanitizedMessage = KommunicateUtils.sanitizeSensitiveInfo(message, settings);

    assert.equal(
        sanitizedMessage,
        'Literal __KM_URL_TOKEN_0__ before https://example.test/$1/4242-4242-4242-4242.png and card XXXX XXXX XXXX XXXX'
    );
});

test('custom patterns mask only unprotected text and keep protected URLs intact', () => {
    const KommunicateUtils = loadKommunicateUtils();
    const settings = {
        maskCustomPatterns: true,
        customRegexPatterns: ['secret', '__KM_URL_TOKEN_[A-Z0-9_]+__'],
    };
    const message = 'secret https://example.test/path/to/resource';

    const sanitizedMessage = KommunicateUtils.sanitizeSensitiveInfo(message, settings);

    assert.equal(sanitizedMessage, 'XXXXXX https://example.test/path/to/resource');
});
