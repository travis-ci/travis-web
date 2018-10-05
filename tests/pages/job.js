import {
  create,
  visitable,
  clickable,
  collection,
  hasClass,
  isVisible,
  text,
  attribute,
} from 'ember-cli-page-object';

import joinTexts from './helpers/join-texts';


import ymlMessages from './yml-messages';

export default create({
  visit: visitable('travis-ci/travis-web/jobs/1'),

  branch: text('.commit-branch'),
  message: text('.build-title'),
  state: text('.build-status .inner-underline'),
  log: text('#log'),
  logError: text('.job-log .notice-banner--red'),
  rawLogUrl: attribute('href', '.download-log-button'),

  createdBy: {
    scope: '.commit-author',

    href: attribute('href', 'a'),
    text: text('.label-align', { multiple: true }),
    avatarSrc: attribute('src', 'img'),
  },

  hasTruncatedLog: isVisible('.log-container p.warning'),

  toggleLog: clickable('.toggle-log-button'),

  ymlMessages,

  logLines: collection('pre#log .log-line', {
    entireLineText: joinTexts('span'),

    isBlack: hasClass('black', 'span:first-of-type'),
    isRed: hasClass('red', 'span:first-of-type'),
    isGreen: hasClass('green', 'span:first-of-type'),
    isYellow: hasClass('yellow', 'span:first-of-type'),
    isBlue: hasClass('blue', 'span:first-of-type'),
    isMagenta: hasClass('magenta', 'span:first-of-type'),
    isCyan: hasClass('cyan', 'span:first-of-type'),
    isWhite: hasClass('white', 'span:first-of-type'),
    isGrey: hasClass('grey', 'span:first-of-type'),

    hasBlackBackground: hasClass('bg-black', 'span:first-of-type'),
    hasRedBackground: hasClass('bg-red', 'span:first-of-type'),
    hasGreenBackground: hasClass('bg-green', 'span:first-of-type'),
    hasYellowBackground: hasClass('bg-yellow', 'span:first-of-type'),
    hasBlueBackground: hasClass('bg-blue', 'span:first-of-type'),
    hasMagentaBackground: hasClass('bg-magenta', 'span:first-of-type'),
    hasCyanBackground: hasClass('bg-cyan', 'span:first-of-type'),
    hasWhiteBackground: hasClass('bg-white', 'span:first-of-type'),

    isBolded: hasClass('bold', 'span:first-of-type'),
    isItalicised: hasClass('italic', 'span:first-of-type'),
    isUnderlined: hasClass('underline', 'span:first-of-type')
  }),

  logFolds: collection('pre#log .fold-start', {
    name: text('span.fold-name'),
    duration: text('.duration'),
    toggle: clickable('.log-line:first-of-type'),
    isOpen: hasClass('open')
  }),

  restartJob: clickable('.action-button--restart'),
  cancelJob: clickable('.action-button--cancel'),
  debugJob: clickable('.action-button--debug'),

  deleteLog: clickable('button.remove-log-button'),
  deleteModalAppears: isVisible('.ember-modal-dialog'),
  confirmDeleteLog: clickable('button.button-delete'),

  jobNotFoundMessage: text('h2.page-title'),
});
