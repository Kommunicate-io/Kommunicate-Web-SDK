function minifyHtml(html) {
    return html
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/\r?\n|\t/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .replace(/>\s+</g, '><')
        .replace(/\s+(?=>)/g, '')
        .trim();
}

module.exports = {
    minifyHtml,
};
