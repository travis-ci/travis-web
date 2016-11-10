import PageObject from 'travis/tests/page-object';

let {
  hasClass
} = PageObject;

export default PageObject.create({
  scope: '.topbar',

  broadcastTower: {
    scope: '.broadcast',
    hasWarning: hasClass('warning', '.icon-broadcast')
  }
});
