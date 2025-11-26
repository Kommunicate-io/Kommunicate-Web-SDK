const { execSync } = require('child_process');
const path = require('path');

function resolveBranch() {
    const envBranch = process.env._BRANCH || process.env.BRANCH;
    if (envBranch) return envBranch;
    try {
        return execSync('git rev-parse --abbrev-ref HEAD', {
            cwd: path.join(__dirname, '..', '..'),
            encoding: 'utf8',
            timeout: 2000,
        })
            .toString()
            .trim();
    } catch (e) {
        return 'unknown-branch';
    }
}

module.exports = {
    resolveBranch,
};
