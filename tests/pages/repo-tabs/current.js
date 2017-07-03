import {
  create,
  visitable,
  hasClass,
  text,
  isVisible
} from 'ember-cli-page-object';

export default create({
  visit: visitable('travis-ci/travis-web'),
  currentTabActive: hasClass('active', '#tab_current a'),
  showsNoBuildsMessaging: text('.missing-notice h2.page-title'),
  showsCurrentBuild: hasClass('started', 'section.build-header'),
  noJobsErrorMessage: isVisible('.notice-banner--red')
});
