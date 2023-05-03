const { danger, message, fail, warn, schedule } = require("danger");
const { default: jiraIssue } = require("danger-plugin-jira-issue");
// const { default: noConsole } = require("danger-plugin-no-console"); this plugin has some issues

const PR_REVIEWS_CHECKS = Object.freeze({
    BIG_PR_THRESHOLD: 700,
    REMOVED_LINE_THRESHOLD: 200,
    TEAMS_INITIALS: ["FW", "TD", "FF", "FWH", "FFH", "TDH"],
    WARNS: {
        TITLE: `Title required Issue number`,
        CHECK_LOCK_FILE: `:exclamation: Changes were made to package.json, but not to package-lock.json - <i>'Perhaps you need to run \`npm install\`?'`,
        WIP: `PR is classed as Work in Progress`,
        EXCEED_THRESHOLD: `:exclamation: Your PR has over 700 lines of code, please consider breaking it down so we can effectively review it. :thumbsup:`,
        MERGE_CONFLICTS: `Please merge development branch`,
        ONLY_DEV_BRANCH: `:exclamation: Please re-submit this PR to development branch, we may have already fixed your issue. 🙏`,
        MISSING_DES: `:exclamation: Please add a description to your PR to make it easier to review`,
        MERGE_COMMITS: `Please rebase to get rid of the merge commits in this PR 🙏`,
        FILE_ISSUE: `Please file the issue for development branch`,
        PATH_WARN: `Make sure to file it for development branch as well`,
        REVIEWER_REQ: `:exclamation: Please make sure to assign reviewer in this PR`,
        PACKAGE_JSON_ERR: `Changes were made to package.json, but not to package-lock.json - <i>'Perhaps you need to run \`npm install\`?'`
    },
    SUCCESS: {
        LINES_REMOVED : `:tada: The PR removed ${danger.github.pr.deletions} lines. :clap:`,
        NEW_FILES: `New Files in this PR: \n - `
    }
});

// check if PR is in WIP
if (danger.github.pr.title.toLowerCase().includes("[wip]")) return warn(PR_REVIEWS_CHECKS.WARNS.WIP);

//Accept PR only for development branch and warn
if(danger.github.pr.head.ref == "master") warn(PR_REVIEWS_CHECKS.WARNS.ONLY_DEV_BRANCH);

//checks for description
const isDesAdded = danger.github.pr.body.length <= 10;
isDesAdded && fail(PR_REVIEWS_CHECKS.WARNS.MISSING_DES);

// new Files in the PR
const newFiles = danger.git.created_files.join(" , ") || 0;
message(`${PR_REVIEWS_CHECKS.SUCCESS.NEW_FILES} ${newFiles}` );

// check PR is changes Threshold
const removedLines = danger.github.pr.deletions,
    totalChanges = danger.github.pr.additions + removedLines > PR_REVIEWS_CHECKS.BIG_PR_THRESHOLD;
totalChanges && warn(PR_REVIEWS_CHECKS.WARNS.EXCEED_THRESHOLD);

// check PR delete lines status
if(removedLines > PR_REVIEWS_CHECKS.REMOVED_LINE_THRESHOLD) message(PR_REVIEWS_CHECKS.SUCCESS.LINES_REMOVED);

// check if PR has some merge conflicts
const mergeCommits = danger.github.commits.filter(({ commit }) => {
    commit.message.includes(`Merge branch development`)
});
if(mergeCommits.length) fail(PR_REVIEWS_CHECKS.WARNS.MERGE_COMMITS)

// Check if package.json is modified but package-lock.json is modified or not
// ideally both should be modified
const packageChanged = danger.git.modified_files.includes("package.json"),
    lockfileChanged = danger.git.modified_files.includes("package-lock.json");
if (packageChanged && !lockfileChanged) fail(PR_REVIEWS_CHECKS.WARNS.PACKAGE_JSON_ERR);

//checks for console.log in PR
// schedule(noConsole({ whitelist: ['error', 'warn'] }))

jiraIssue({
    key: PR_REVIEWS_CHECKS.TEAMS_INITIALS,
    url: "https://kommunicate.atlassian.net/browse",
    format(emoji, jiraUrls) {
        return `Jira Issue Link - ${emoji} ${jiraUrls}`;
    },
    fail_on_warning: false,
});
