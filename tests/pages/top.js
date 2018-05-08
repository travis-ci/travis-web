import {
  create,
  clickable,
  collection,
  hasClass,
  isHidden,
  notHasClass,
  text
} from 'ember-cli-page-object';

export default create({
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

  broadcasts: {
    scope: 'ul.broadcasts',

    isClosed: notHasClass('is-open'),
    isOpen: hasClass('is-open'),


    items: collection('li', {
      isAnnouncement: hasClass('announcement', '.broadcast-status'),
      isWarning: hasClass('warning', '.broadcast-status'),

      message: text('.message'),

      dismiss: clickable('.broadcast-close')
    })
  },

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

  clickSignOutLink: clickable('ul.navigation-nested li:last a'),
});
