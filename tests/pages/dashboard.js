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
  activeRepos: collection({
    scope: '.dashboard-active .repo-list',
    itemScope: 'li.rows--dashboard',
    item: {
      owner: text('.dash-header .row-label a'),
      repoName: text('.dash-header .row-content a'),
      defaultBranch: text('.dash-default .row-content a'),
      lastBuild: text('.dash-last a .label-align'),
      triggerBuild: clickable('.dash-menu .dropup-list li:first-of-type a'),
      clickStarButton: clickable('.dash-head .dash-star')
    }
  }),
  starredRepos: collection({
    scope: '.dashboard-starred .repo-list',
    itemScope: 'li.rows--dashboard',
    item: {
      owner: text('.dash-header .row-label a'),
      repoName: text('.dash-header .row-content a'),
      defaultBranch: text('.dash-default .row-content a'),
      lastBuild: text('.dash-last a .label-align'),
      triggerBuild: clickable('.dash-menu .dropup-list li:first-of-type a'),
      clickUnStarButton: clickable('.dash-head .dash-star')
    }
  }),
  paginationIsVisible: isVisible('.pagination-navigation'),
  paginationLinks: collection({
    scope: '.pagination-navigation',
    itemScope: 'li',
    item: {
      label: text('a'),
      page: clickable('a')
    }
  }),
  flashMessage: text('.flash li.success')
});
