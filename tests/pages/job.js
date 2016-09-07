import PageObject from 'travis/tests/page-object';

let {
  visitable,
  clickable,
  text
} = PageObject;

export default PageObject.create({
  visit: visitable('travis-ci/travis-web/jobs/1'),

  branch: text('.commit-branch'),
  message: text('.build-title'),
  state: text('.build-status'),
  author: text('.commit-author'),
  log: text('#log'),
  logError: text('.job-log .notice'),

  restartJob: clickable('.action-button--restart'),
  cancelJob: clickable('.action-button--cancel'),
  debugJob: clickable('.action-button--debug'),
  restartedNotification: text('p.flash-message'),
  cancelledNotification: text('p.flash-message')
});
