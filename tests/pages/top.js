import PageObject from 'travis/tests/page-object';

let {
  clickable,
  collection,
  hasClass,
  isHidden,
  notHasClass,
  text
} = PageObject;

export default PageObject.create({
  scope: '.topbar',

  broadcastTower: {
    scope: '.broadcast .icon-broadcast',

    click: clickable(),

    hasAnnouncement: hasClass('announcement'),
    hasNoAnnouncement: notHasClass('announcement'),
    hasWarning: hasClass('warning')
  },

  broadcastBadge: {
    scope: '.broadcast .count',
    text: text(),
    isHidden: isHidden()
  },

  broadcasts: collection({
    scope: 'ul.broadcasts',

    isClosed: notHasClass('is-open'),
    isOpen: hasClass('is-open'),

    itemScope: 'li',

    item: {
      isAnnouncement: hasClass('announcement', '.broadcast-status'),
      isWarning: hasClass('warning', '.broadcast-status'),

      message: text('.message'),

      dismiss: clickable('.broadcast-close')
    }
  }),

  flashMessage: {
    scope: 'ul.flash li:eq(0)',
    resetScope: true,

    text: text('p.flash-message .message'),
    preamble: text('p.flash-message .preamble'),

    isSuccess: hasClass('success'),
    isNotice: hasClass('notice'),
    isError: hasClass('error'),

    isNotShown: isHidden(),
  },

  clickSigOutLink: clickable('ul.navigation-nested li:last a'),

  enterpriseTrialBanner: {
    scope: '.enterprise-banner',
    resetScope: true
  }
});
