import PageObject from 'travis/tests/page-object';

let {
  clickable,
  visitable,
  text
} = PageObject;

export default PageObject.create({
  visit: visitable('travis-ci/travis-web/builds/1'),
  restartBuild: clickable('.button-circle-trigger'),
  cancelBuild: clickable('.button-circle-cancel'),
  restartedNotification: text('p.flash-message'),
  cancelledNotification: text('p.flash-message'),
  singleJobLogText: text('.log-body pre')
});
