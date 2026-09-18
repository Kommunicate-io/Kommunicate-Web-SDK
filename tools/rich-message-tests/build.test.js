const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const generateTestPages = require('../../webplugin/build-test-pages');

const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'km-test-pages-'));
try {
    for (const environment of ['prod', 'release', 'staging', 'development', 'prod_beta', 'test_agenticfirst']) {
        const target = path.join(temp, environment);
        assert.deepStrictEqual(generateTestPages(environment, target), ['demo2.html']);
        assert(!fs.existsSync(path.join(target, 'rich-message-tests')), `${environment} must not include automation assets`);
        assert(!fs.readFileSync(path.join(target, 'demo2.html'), 'utf8').includes('./rich-message-tests/'), 'Non-test demo must not load automation scripts');
    }
    const target = path.join(temp, 'test');
    const emitted = generateTestPages('test', target);
    assert.deepStrictEqual(emitted.sort(), ['demo2.html', 'rich-message-tests/cases.json', 'rich-message-tests/panel.js', 'rich-message-tests/runner.js']);
    for (const file of emitted) {
        assert.strictEqual(fs.readFileSync(path.join(target, file), 'utf8'),
            fs.readFileSync(path.join(__dirname, '../../example', file), 'utf8'));
    }
    const html = fs.readFileSync(path.join(target, 'demo2.html'), 'utf8');
    for (const match of html.matchAll(/<script src="\.\/([^"]+)"/g)) {
        assert(fs.existsSync(path.join(target, match[1])), 'Page script must resolve in deployed build');
    }
    const panel = fs.readFileSync(path.join(target, 'rich-message-tests/panel.js'), 'utf8');
    assert(panel.includes("fetch('./rich-message-tests/cases.json')"));
    const gulpfile = fs.readFileSync(path.join(__dirname, '../../webplugin/gulpfile.js'), 'utf8');
    assert(gulpfile.includes("generateTestPages(config.getEnvId(), buildDir);"));
    const config = require('../../firebase.json');
    const headers = config.hosting.headers;
    for (const source of ['/demo2.html', '/rich-message-tests/**']) {
        const index = headers.findIndex(rule => rule.source === source);
        assert(index > headers.findIndex(rule => rule.source === '**/*.js'));
        assert(headers[index].headers.some(header => header.key === 'Cache-Control' && header.value === 'no-store'));
    }
    console.log('Test-page build regression tests passed.');
} finally {
    fs.rmdirSync(temp, { recursive: true });
}
