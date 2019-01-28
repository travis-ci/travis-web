import {
  attribute,
  create,
  visitable,
  clickable,
  collection,
  text,
  hasClass,
  isVisible
} from 'ember-cli-page-object';

let dashboardRowObject = {
  owner: text('.dash-header .row-label a'),
  repoName: text('.dash-header .row-content a'),
  defaultBranch: text('.dash-default .row-content a'),
  lastBuild: text('.dash-last a .label-align'),
  triggerBuild: clickable('.dash-menu .dropup-list li:first-of-type button'),
  clickStarButton: clickable('.dash-head .dash-star'),

  menuButton: {
    scope: '.dash-menu .dropup',
    click: clickable('button')
  },

  starButton: {
    scope: '.dash-star',
    title: attribute('title')
  },
};

export default create({
  visit: visitable('/dashboard'),
  repoTitle: text('.repo-title'),
  accountFilter: clickable('.dashboard-header .organisation-filter .option-list a:first-of-type'),
  syncButton: clickable('.dashboard-header .sync-button button'),
  syncButtonIsSyncing: hasClass('is-syncing', '.dashboard-header .sync-button button'),

  activeRepos: {
    visit: clickable('[data-test-active-repos-tab]'),

    repos: collection('.dashboard-active .repo-list li.rows--dashboard', dashboardRowObject)
  },

  starredRepos: collection('.dashboard-starred .repo-list li.rows--dashboard', dashboardRowObject),
  paginationIsVisible: isVisible('.pagination-navigation'),
  paginationLinks: collection('.pagination-navigation li', {
    label: text('a'),
    page: clickable('a')
  }),
  flashMessage: text('.flash li.success'),

  myBuilds: {
    visit: clickable('[data-test-my-builds-tab]'),

    builds: collection('[data-test-my-build]', {
      owner: {
        scope: '[data-test-owner] a',
        href: attribute('href'),
      },

      repo: {
        scope: '[data-test-repo-name] a',
        href: attribute('href'),
      },

      branch: {
        scope: '[data-test-branch-name]',
        text: text('.label-align'),
        href: attribute('href')
      },

      message: {
        scope: '[data-test-commit-message]',
        title: attribute('title'),
      },

      stateAndNumber: {
        scope: '[data-test-state-number]',
        href: attribute('href'),
        text: text('.inner-underline')
      },

      sha: {
        scope: '[data-test-commit-sha]',
        text: text('.label-align'),
        href: attribute('href')
      },

      duration: {
        scope: '[data-test-duration]',
        title: attribute('title'),
        text: text('.label-align'),
      },

      finished: {
        scope: '[data-test-finished]',
        title: attribute('title'),
        text: text('.label-align'),
      },

      isPublic: isVisible('.icon.public'),
      isPrivate: isVisible('.icon.private'),

      isPassed: isVisible('.icon.passed'),
      isFailed: isVisible('.icon.failed'),

      restart: clickable('.action-button--restart'),
    })
  }
});
