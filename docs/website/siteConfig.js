/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* List of projects/orgs using your project for the users page  /test-site */
const users = [
  {
    caption: 'User1',
    image: '/img/km-logos.svg',
    infoLink: 'https://www.facebook.com',
    pinned: true,
  },
];

const siteConfig = {
  title: '' /* title for your website */,
  tagline: 'Customer Communication Software | Kommunicate',
  url: 'https://docs.kommunicate.io' /* your website url */,
  baseUrl: '/' /* base url for your project */,
  organizationName: 'Kommunicate',
  projectName: 'Kommunicate Docs',
  cname: 'kommunicate.io',
  noIndex: false,
  headerLinks: [
    {doc: 'installations', label: 'Docs'},
   
   {/*{doc: 'doc4', label: 'API'},
   {page: 'help', label: 'Help'},
    {blog: true, label: 'Blog'},
  */},
    // Determines search bar position among links
    { search: true }
  ],
  users,
  /* path to images for header/footer */
  headerIcon: 'img/km-logos.svg',
  footerIcon: 'img/km-logos.svg',
  favicon: 'img/favicon.png',
  /* colors for website */
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
  scripts: ['https://buttons.github.io/buttons.js'],
  // You may provide arbitrary config keys to be used as needed by your template.
  repoUrl: 'https://github.com/facebook/test-site',
};

module.exports = siteConfig;
