import {danger, message, fail, warn, schedule} from "danger";
import { jiraIssue } from ("danger-plugin-jira-issue");
import { noConsole } from 'danger-plugin-no-console'

const PR_REVIEWS_CHECKS = Object.freeze({
    BIG_PR_THRESHOLD: 700,
    REMOVED_LINE_THRESHOLD: 200,
    TEAMS_INITIALS: ["FW", "TD", "FF", "FWH", "FFH", "TDH"],
    WARNS: {
        TITLE: `Title required Issue number`,
        CHECK_LOCK_FILE: `:exclamation: Changes were made to package.json, but not to package-lock.json - <i>'Perhaps you need to run \`npm install\`?'`,
        WIP: `PR is classed as Work in Progress`,
        EXCEED_THRESHOLD: `:exclamation: Your PR has over ${BIG_PR_THRESHOLD} lines of code, please consider breaking it down so we can effectively review it. :thumbsup:`,
        MERGE_CONFLICTS: `Please merge development branch`,
        MISSING_DES: `:exclamation: Please add a description to your PR to make it easier to review`,
        MERGE_COMMITS: `Please rebase to get rid of the merge commits in this PR 🙏`,
        FILE_ISSUE: `Please file the issue for development branch`,
        PATH_WARN: `Make sure to file it for development branch as well`,
        REVIEWER_REQ: `:exclamation: Please make sure to assign reviewer in this PR`,
        PACKAGE_JSON_ERR: `Changes were made to package.json, but not to package-lock.json - <i>'Perhaps you need to run \`npm install\`?'`
    },
    SUCCESS: {
        LINES_REMOVED : `:tada: The PR removed ${danger.github.pr.deletions} lines. :clap:`,
        NEW_FILES: `New Files in this PR: \n - " ${newFiles}`
    }
});

// check if PR is in WIP
if (danger.github.pr.title.toLowerCase().includes("[wip]")) return warn(PR_REVIEWS_CHECKS.WARNS.WIP);

//checks for description
const isDesAdded = danger.github.pr.body.length == 0;
isDesAdded && fail(PR_REVIEWS_CHECKS.WARNS.MISSING_DES);

// new Files in the PR
const newFiles = danger.git.created_files.join("- ");
message(PR_REVIEWS_CHECKS.SUCCESS.NEW_FILES);

// check PR is changes Threshold
const removedLines = danger.github.pr.deletions,
    totalChanges = danger.github.pr.additions + removedLines > PR_REVIEWS_CHECKS.BIG_PR_THRESHOLD;
totalChanges && warn(PR_REVIEWS_CHECKS.WARNS.EXCEED_THRESHOLD);

// check PR delete lines status
if(removedLines > PR_REVIEWS_CHECKS.REMOVED_LINE_THRESHOLD) message(PR_REVIEWS_CHECKS.SUCCESS.LINES_REMOVED);

// check if PR has some merge conflicts
const mergeCommits = danger.github.commits.filter(({ commit }) => commit.message.includes(`Merge branch 'development'`));
if(mergeCommits.length) fail(PR_REVIEWS_CHECKS.WARNS.MERGE_COMMITS)

// Check if package.json is modified but package-lock.json is modified or not
// ideally both should be modified
const packageChanged = danger.git.modified_files.includes("package.json"),
    lockfileChanged = danger.git.modified_files.includes("package-lock.json");
if (packageChanged && !lockfileChanged) fail(PR_REVIEWS_CHECKS.WARNS.PACKAGE_JSON_ERR);

//checks for console.log in PR
schedule(noConsole({ whitelist: ['error', 'warn'] }))

jiraIssue({
    key: PR_REVIEWS_CHECKS.TEAMS_INITIALS,
    url: "https://kommunicate.atlassian.net/browse",
    format(emoji, jiraUrls) {
        return `Jira Link - ${emoji} ${jiraUrls}`;
    },
    fail_on_warning: false,
});
