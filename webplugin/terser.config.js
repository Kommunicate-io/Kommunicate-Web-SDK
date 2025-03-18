const isTestEnv = ['development', 'test', 'release'].includes(process.env.NODE_ENV);

console.log('isTestEnv: ', isTestEnv);

module.exports = {
    compress: {
        drop_console: !isTestEnv && ['log', 'warn', 'info'],
        drop_debugger: !isTestEnv,
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
