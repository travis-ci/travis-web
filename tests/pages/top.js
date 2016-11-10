import PageObject from 'travis/tests/page-object';

let {
  clickable,
  collection,
  hasClass,
  notHasClass
} = PageObject;

export default PageObject.create({
  scope: '.topbar',

  broadcastTower: {
    scope: '.broadcast .icon-broadcast',

    click: clickable(),

    hasAnnouncement: hasClass('announcement'),
    hasWarning: hasClass('warning')
  },

  broadcasts: collection({
    scope: 'ul.broadcasts',

    isClosed: notHasClass('is-open'),
    isOpen: hasClass('is-open'),

    itemScope: 'li',

    item: {
      isAnnouncement: hasClass('announcement', '.broadcast-status'),
      isWarning: hasClass('warning', '.broadcast-status')
    }
  })
});
