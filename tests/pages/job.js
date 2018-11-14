import {
  create,
  visitable,
  clickable,
  collection,
  hasClass,
  isVisible,
  text,
  attribute
} from 'ember-cli-page-object';


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

  yamlTab: {
    click: clickable('[data-test-build-yaml-tab]'),
  },

  ymlMessages,

  logLines: collection('pre#log .log-line span:first-of-type', {
    text: text(),
    nextText: text('+ span'),

    isBlack: hasClass('black'),
    isRed: hasClass('red'),
    isGreen: hasClass('green'),
    isYellow: hasClass('yellow'),
    isBlue: hasClass('blue'),
    isMagenta: hasClass('magenta'),
    isCyan: hasClass('cyan'),
    isWhite: hasClass('white'),
    isGrey: hasClass('grey'),

    hasBlackBackground: hasClass('bg-black'),
    hasRedBackground: hasClass('bg-red'),
    hasGreenBackground: hasClass('bg-green'),
    hasYellowBackground: hasClass('bg-yellow'),
    hasBlueBackground: hasClass('bg-blue'),
    hasMagentaBackground: hasClass('bg-magenta'),
    hasCyanBackground: hasClass('bg-cyan'),
    hasWhiteBackground: hasClass('bg-white'),

    isBolded: hasClass('bold'),
    isItalicised: hasClass('italic'),
    isUnderlined: hasClass('underline')
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
