import {
  create,
  visitable,
  clickable,
  collection,
  text,
  hasClass
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/'),
  clickSidebarMyReposTab: clickable('#tab_owned a'),
  clickSidebarRunningTab: clickable('#tab_running a'),
  runningTabIsActive: hasClass('active', '#tab_running'),
  myReposTabIsActive: hasClass('active', '#tab_owned'),
  navigateToProfilePage: clickable('#profile-page-link'),
  sidebarRepositories: collection({
    scope: 'ul.repos-list',
    itemScope: 'li.repo',
    item: {
      name: text('.tile h2.tile-title span.label-align')
    }
  }),
  sidebarRunningRepositories: collection({
    scope: '.sidebar-list',
    itemScope: '.tile--sidebar',
    item: {
      name: text('.tile h2.tile-title span.label-align')
    }
  }),
  viewRunningJob: clickable('p.tile-title a')
});
