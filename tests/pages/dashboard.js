import {
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
  activeRepos: collection('.dashboard-active .repo-list li.rows--dashboard', {
    owner: text('.dash-header .row-label a'),
    repoName: text('.dash-header .row-content a'),
    defaultBranch: text('.dash-default .row-content a'),
    lastBuild: text('.dash-last a .label-align'),
    triggerBuild: clickable('.dash-menu .dropup-list li:first-of-type a'),
    clickStarButton: clickable('.dash-head .dash-star'),
    hasTofuButton: isVisible('.dash-menu .dropup')
  }),
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
  flashMessage: text('.flash li.success')
});
