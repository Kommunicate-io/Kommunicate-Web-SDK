const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');
const sass = require('sass');

const scssEntry = path.join(__dirname, '..', 'webplugin', 'scss', 'mck-tab-visibility.scss');
const cssTarget = path.join(__dirname, '..', 'webplugin', 'css', 'app', 'mck-tab-visibility.css');

const normalize = (value) => value.replace(/\r\n/g, '\n').trimEnd();

const compiledCss = sass.compile(scssEntry, { style: 'expanded' }).css;
const compiledWithNewline = compiledCss.endsWith('\n') ? compiledCss : `${compiledCss}\n`;
const existingCss = fs.readFileSync(cssTarget, 'utf8');

if (normalize(compiledWithNewline) !== normalize(existingCss)) {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'km-tab-vis-'));
    const tmpFile = path.join(tmpDir, 'mck-tab-visibility.css');
    fs.writeFileSync(tmpFile, compiledWithNewline, 'utf8');

    console.error(
        'mck-tab-visibility.css is out of sync with mck-tab-visibility.scss. ' +
            'Rebuild with `npx sass webplugin/scss/mck-tab-visibility.scss:webplugin/css/app/mck-tab-visibility.css --no-source-map --style=expanded`.'
    );

    const diffResult = spawnSync('diff', ['-u', cssTarget, tmpFile], { stdio: 'inherit' });
    process.exit(diffResult.status === null ? 1 : diffResult.status);
}

console.log('mck-tab-visibility.css is in sync with mck-tab-visibility.scss');
