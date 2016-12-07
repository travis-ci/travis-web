import {
  create,
  visitable,
  clickable,
  collection,
  text,
  hasClass
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/dashboard'),
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
      triggerBuild: clickable('.dash-menu .dropup-list li:first-of-type a')
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
      triggerBuild: clickable('.dash-menu .dropup-list li:first-of-type a')
    }
  }),
  flashMessage: text('.flash li.success')
});
