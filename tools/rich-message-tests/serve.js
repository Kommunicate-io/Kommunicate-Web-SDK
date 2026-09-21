// Run with: node tools/rich-message-tests/serve.js
// Serve only the test page's public assets, never the rest of the repository.
const http = require('http');
const fs = require('fs');
const path = require('path');
const assets = {
    '/': ['demo2.html', 'text/html'],
    '/demo2.html': ['demo2.html', 'text/html'],
    '/rich-message-tests/runner.js': ['rich-message-tests/runner.js', 'application/javascript'],
    '/rich-message-tests/panel.js': ['rich-message-tests/panel.js', 'application/javascript'],
    '/rich-message-tests/cases.json': ['rich-message-tests/cases.json', 'application/json'],
};
const server = http.createServer((req, res) => {
    const asset = assets[new URL(req.url, 'http://localhost').pathname];
    if (!asset || !['GET', 'HEAD'].includes(req.method)) {
        res.writeHead(404);
        res.end('Not found');
        return;
    }
    fs.readFile(path.join(__dirname, '../../example', asset[0]), (error, data) => {
        if (error) {
            res.writeHead(500);
            res.end('Unable to read test asset');
            return;
        }
        res.writeHead(200, { 'Content-Type': asset[1] + '; charset=utf-8', 'Cache-Control': 'no-store' });
        res.end(req.method === 'HEAD' ? undefined : data);
    });
});
server.on('error', error => {
    console.error('Cannot start test page:', error.message);
    process.exitCode = 1;
});
server.listen(8080, '127.0.0.1', () => {
    console.log('Rich-message tests: http://127.0.0.1:8080/demo2.html');
    console.log('Press Ctrl+C to stop. Widget and bot requests use the hosted test environment.');
});
