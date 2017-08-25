import {
  create,
  visitable,
  clickable,
  collection,
  text,
  fillable,
  triggerable,
  hasClass
} from 'ember-cli-page-object';
import ts from 'ember-test-selectors';

export default create({
  visit: visitable('/'),
  repoTitle: text(ts('repository-header-title')),
  clickSidebarMyReposTab: clickable(ts('my-repositories-link')),
  clickSidebarRunningTab: clickable(ts('running-repositories-link')),
  runningTabIsActive: hasClass('active', ts('running-repositories-link')),
  myReposTabIsActive: hasClass('active', ts('my-repositories-link')),
  navigateToProfilePage: clickable(ts('getting-started-profile-page-link')),
  sidebarRepositories: collection({
    scope: ts('sidebar-repositories'),
    itemScope: ts('sidebar-repository'),
    item: {
      name: text(ts('sidebar-repository-title'))
    }
  }),
  sidebarRunningTabText: text(ts('running-repositories-link')),
  sidebarRunningRepositories: collection({
    scope: ts('sidebar-running-jobs'),
    itemScope: ts('sidebar-running-job'),
    item: {
      name: text('.tile h2.tile-title span.label-align')
    }
  }),
  missingReposMessage: text(ts('no-repositories-message')),
  viewRunningJob: clickable(ts('running-job-number-link')),
  enterSearchQuery: fillable(ts('sidebar-search-input')),
  pressEnter: triggerable('keyup', ts('sidebar-search-input'), { eventProperties: { keyCode: 13 } }),
});
