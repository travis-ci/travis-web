import PageObject from 'travis/tests/page-object';

let {
  hasClass
} = PageObject;

export default PageObject.create({
  scope: '.topbar',

  broadcastTower: {
    scope: '.broadcast',
    hasAnnouncement: hasClass('announcement', '.icon-broadcast'),
    hasWarning: hasClass('warning', '.icon-broadcast')
  }
});
