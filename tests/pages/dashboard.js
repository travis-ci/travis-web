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
  accountFilter: clickable('.dashboard-header .organisation-filter'),
  syncButton: clickable('.dashboard-header .sync-button button'),
  syncButtonIsSyncing: hasClass('is-syncing', '.dashboard-header .sync-button button'),
  activeRepos: collection({
    scope: '.dashboard-active .repo-list',
    itemScope: 'li.rows--dashboard',
    item: {
      owner: text('.dash-header .row-label a'),
      repoName: text('.dash-header .row-content a'),
      defaultBranch: text('.dash-default .row-content a'),
      lastBuild: text('.dash-last .row-content a'),
      triggerBuild: clickable('.dash-menu .dropup-list li:first-of-type a')
    }
  }),
  flashMessage: text('.flash li.success')
});
