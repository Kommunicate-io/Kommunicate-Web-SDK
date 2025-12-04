const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');
const sass = require('sass');

const rootDir = path.join(__dirname, '..');

const targets = [
    {
        scss: path.join(rootDir, 'webplugin', 'scss', 'mck-tab-visibility.scss'),
        css: [
            path.join(rootDir, 'webplugin', 'css', 'app', 'mck-tab-visibility.css'),
            path.join(rootDir, 'webplugin', 'css', 'app', 'style', 'mck-tab-visibility.css'),
        ],
    },
    {
        scss: path.join(rootDir, 'webplugin', 'scss', 'km-bottom-nav.scss'),
        css: [
            path.join(rootDir, 'webplugin', 'css', 'app', 'km-bottom-nav.css'),
            path.join(rootDir, 'webplugin', 'css', 'app', 'style', 'km-bottom-nav.css'),
        ],
    },
    {
        scss: path.join(rootDir, 'webplugin', 'scss', 'style.scss'),
        css: [path.join(rootDir, 'webplugin', 'css', 'app', 'style', 'style.css')],
    },
];

const normalize = (value) =>
    (value || '')
        .replace(/\r\n/g, '\n')
        // Ignore indentation differences
        .replace(/^[ \t]+/gm, '')
        .trimEnd();

const compileScss = (entryPath) => {
    try {
        return sass.compile(entryPath, { style: 'expanded' }).css;
    } catch (err) {
        console.error(
            `Failed to compile SCSS at ${entryPath}: ${err && err.stack ? err.stack : err.message}`
        );
        process.exit(1);
    }
};

const readCss = (targetPath) => {
    try {
        return { content: fs.readFileSync(targetPath, 'utf8'), missing: false };
    } catch (err) {
        if (err && err.code === 'ENOENT') {
            console.warn(`CSS target missing at ${targetPath}; treating as empty.`);
            return { content: '', missing: true };
        }
        console.error(
            `Failed to read CSS at ${targetPath}: ${err && err.stack ? err.stack : err.message}`
        );
        process.exit(1);
    }
};

const checkPair = ({ scss, css }) => {
    const compiledCss = compileScss(scss);
    const compiledWithNewline = compiledCss.endsWith('\n') ? compiledCss : `${compiledCss}\n`;

    css.forEach((cssPath) => {
        const { content: existingCss, missing } = readCss(cssPath);

        if (normalize(compiledWithNewline) === normalize(existingCss)) {
            return;
        }

        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'km-scss-sync-'));
        const compiledFile = path.join(tmpDir, path.basename(cssPath));
        const existingFile = missing ? path.join(tmpDir, 'existing.css') : cssPath;

        try {
            fs.writeFileSync(compiledFile, compiledWithNewline, 'utf8');
            if (missing) {
                fs.writeFileSync(existingFile, existingCss, 'utf8');
            }

            const scssRel = path.relative(rootDir, scss);
            const cssRel = path.relative(rootDir, cssPath);

            console.error(
                `${cssRel} is out of sync with ${scssRel}. ` +
                    `Rebuild with \`npx sass ${scssRel}:${cssRel} --no-source-map --style=expanded\`.`
            );

            const diffResult = spawnSync('diff', ['-u', existingFile, compiledFile], {
                stdio: 'inherit',
            });
            process.exit(diffResult.status === null ? 1 : diffResult.status);
        } finally {
            try {
                fs.rmSync(tmpDir, { recursive: true, force: true });
            } catch (cleanupErr) {
                console.warn('Failed to remove temp directory', cleanupErr);
            }
        }
    });
};

for (const pair of targets) {
    checkPair(pair);
}

console.log('All SCSS targets are in sync with their compiled CSS.');
