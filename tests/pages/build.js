import PageObject from 'travis/tests/page-object';

let {
  clickable,
  visitable,
  text
} = PageObject;

export default PageObject.create({
  visit: visitable('travis-ci/travis-web/builds/1'),
  restartBuild: clickable('.button-circle-trigger'),
  restartedNotification: text('p.flash-message')
});
