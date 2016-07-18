import {
  create,
  visitable,
  hasClass,
  text
} from 'ember-cli-page-object';

export default create({
  visit: visitable('travis-ci/travis-web'),
  currentTabActive: hasClass('active', '#tab_current'),
  showsNoBuildsMessaging: text('.missing-notice h2.page-title'),
  showsCurrentBuild: hasClass('passed', 'section.build-header')
});
