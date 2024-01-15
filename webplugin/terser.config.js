module.exports = {
    compress: {
        drop_console: true,
        dead_code: true,
        keep_fnames: true,
    },
    mangle: {
        keep_fnames: true,
    },
    output: {
        comments: false,
        ecma: 5,
    },
};
