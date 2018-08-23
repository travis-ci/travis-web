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

export default create({
  visit: visitable('/dashboard'),
  repoTitle: text('.repo-title'),
  accountFilter: clickable('.dashboard-header .organisation-filter .option-list a:first-of-type'),
  syncButton: clickable('.dashboard-header .sync-button button'),
  syncButtonIsSyncing: hasClass('is-syncing', '.dashboard-header .sync-button button'),

  activeRepos: {
    visit: clickable('[data-test-active-repos-tab]'),

    repos: collection('.dashboard-active .repo-list li.rows--dashboard', {
      owner: text('.dash-header .row-label a'),
      repoName: text('.dash-header .row-content a'),
      defaultBranch: text('.dash-default .row-content a'),
      lastBuild: text('.dash-last a .label-align'),
      triggerBuild: clickable('.dash-menu .dropup-list li:first-of-type a'),
      clickStarButton: clickable('.dash-head .dash-star'),
      hasTofuButton: isVisible('.dash-menu .dropup')
    })
  },

  starredRepos: collection('.dashboard-starred .repo-list li.rows--dashboard', {
    owner: text('.dash-header .row-label a'),
    repoName: text('.dash-header .row-content a'),
    defaultBranch: text('.dash-default .row-content a'),
    lastBuild: text('.dash-last a .label-align'),
    triggerBuild: clickable('.dash-menu .dropup-list li:first-of-type a'),
    clickUnStarButton: clickable('.dash-head .dash-star'),
    hasTofuButton: isVisible('.dash-menu .dropup')
  }),
  paginationIsVisible: isVisible('.pagination-navigation'),
  paginationLinks: collection('.pagination-navigation li', {
    label: text('a'),
    page: clickable('a')
  }),
  flashMessage: text('.flash li.success'),

  myBuilds: {
    visit: clickable('[data-test-my-builds-tab]'),

    builds: collection('[data-test-my-build]', {
      owner: text('[data-test-owner]'),
      repo: text('[data-test-repo-name]'),
      branch: text('[data-test-branch-name]'),
      message: text('[data-test-commit-message]'),
      stateAndNumber: {
        scope: '[data-test-state-number]',
        href: attribute('href'),
        text: text('.inner-underline')
      },

      sha: {
        scope: '[data-test-commit-sha]',
        href: attribute('href')
      },

      duration: text('[data-test-duration]'),
      finished: text('[data-test-finished]'),

      isPublic: isVisible('.icon.public'),
      isPrivate: isVisible('.icon.private'),

      isPassed: isVisible('.icon.passed'),
      isFailed: isVisible('.icon.failed'),

      restart: clickable('.action-button--restart'),
    })
  }
});
