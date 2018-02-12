/**
 * Copyright (c) 2017-present, Kommunicate, Inc.
 */

/* List of projects/orgs using your project for the users page  /test-site */
const users = [
  {
    caption: 'User1',
    image: '/img/km-logos.svg',
    infoLink: 'https://www.kommunicate.io',
    pinned: true,
  },
];

const siteConfig = {
  title: 'Help Docs' /* title for your website */,
  tagline: "Configure Kommunicate's support platform for your product or site. Find integration and implementation guide along with code samples.",
  url: 'https://docs.kommunicate.io' /* your website url */,
  baseUrl: '/' /* base url for your project */,
  organizationName: 'Kommunicate',
  projectName: 'Kommunicate Docs',
  cname: 'kommunicate.io',
  noIndex: false,
  headerLinks: [
    {doc: 'installation', label: 'Docs'},
    // Determines search bar position among links
    { search: true },
   
   {/*{doc: 'doc4', label: 'API'},
   {page: 'help', label: 'Help'},
    {blog: true, label: 'Blog'},
  */}
  ],
  users,
  /* path to images for header/footer */
  headerIcon: 'img/km-logos.svg',
  footerIcon: 'img/km-logos.svg',
  favicon: 'img/favicon.png',
  /* colors for website */
  algolia: {
    apiKey: 'ea8d43f94ab17ce061d7507938f3433f',
    indexName: 'kommunicate',
    debug: 'true',
  },
  colors: {
    primaryColor: '#5C5AA7',
    secondaryColor: '#312f6f',
  },
  // This copyright info is used in /core/Footer.js and blog rss/atom feeds.
  copyright: 'Copyright © ' + new Date().getFullYear() + ' Kommunicate',
  // organizationName: 'deltice', // or set an env variable ORGANIZATION_NAME
  // projectName: 'test-site', // or set an env variable PROJECT_NAME
  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: 'vs2015',
  },
  // scripts: ['https://buttons.github.io/buttons.js'],
  // You may provide arbitrary config keys to be used as needed by your template.
  // repoUrl: 'https://github.com/facebook/test-site',
};

module.exports = siteConfig;
