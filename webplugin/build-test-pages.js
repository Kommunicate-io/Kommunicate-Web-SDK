const fs = require('fs');
const path = require('path');

const runtimeFiles = ['runner.js', 'panel.js', 'cases.json'];

// Keep the existing demo page in every build; include automation only in test.
module.exports = function generateTestPages(environment, buildDir) {
    const source = path.join(__dirname, '../example');
    let html = fs.readFileSync(path.join(source, 'demo2.html'), 'utf8');
    if (environment !== 'test') {
        html = html.replace(/        <!-- rich-message-tests:start -->[\s\S]*?<!-- rich-message-tests:end -->\n/, '');
    }
    fs.mkdirSync(buildDir, { recursive: true });
    fs.writeFileSync(path.join(buildDir, 'demo2.html'), html);
    const emitted = ['demo2.html'];
    if (environment === 'test') {
        fs.mkdirSync(path.join(buildDir, 'rich-message-tests'), { recursive: true });
        runtimeFiles.forEach(file => {
            const relativePath = 'rich-message-tests/' + file;
            fs.copyFileSync(path.join(source, relativePath), path.join(buildDir, relativePath));
            emitted.push(relativePath);
        });
    }
    return emitted;
};
