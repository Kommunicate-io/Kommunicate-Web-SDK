const isTestEnv = ['development', 'test', 'release'].includes(
    process.env.NODE_ENV
);

module.exports = {
    compress: {
        drop_console: !isTestEnv,
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
