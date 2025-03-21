import {
  create,
  visitable,
  clickable,
  collection,
  hasClass,
  notHasClass,
  isVisible,
  text,
  attribute
} from 'ember-cli-page-object';

import joinTexts from 'travis/tests/pages/helpers/join-texts';

export default create({
  visit: visitable('travis-ci/travis-web/jobs/1'),

  branch: text('.commit-branch'),
  message: text('.build-title'),
  state: text('.build-status .inner-underline'),
  badge: text('[data-test-build-header-draft-badge]'),
  log: text('#log'),
  logError: text('.job-log .notification-error'),
  rawLogUrl: attribute('href', '.download-log-button'),

  createdBy: {
    scope: '.commit-author',

    href: attribute('href', 'a'),
    _text: collection('.label-align'),
    avatarSrc: attribute('src', 'img'),
    get text() {
      return this._text.map((t) => t.text);
    }
  },

  waitingStates: {
    scope: '.job-waiting-stages-container',

    one: {
      scope: '.stage-1-container',
      isInactive: hasClass('not-loaded-ring'),
      isLoading: hasClass('spinner', 'svg'),
      isLoaded: hasClass('stage-loaded-ring'),
      text: text('.stage-1-message'),
    },

    two: {
      scope: '.stage-2-container',
      isInactive: hasClass('not-loaded-ring'),
      isLoading: hasClass('spinner', 'svg'),
      isLoaded: hasClass('stage-loaded-ring'),
      text: text('.stage-2-message'),
    },

    three: {
      scope: '.stage-3-container',
      isInactive: hasClass('not-loaded-ring'),
      isLoading: hasClass('spinner', 'svg'),
      isLoaded: hasClass('stage-loaded-ring'),
      text: text('.stage-3-message'),
    },

    firstMessage: {
      text: text('.stage-1-message')
    },

    secondMessage: {
      text: text('.stage-2-message')
    },

    thirdMessage: {
      text: text('.stage-3-message')
    },

    firstLoadingLine: {
      scope: '.loading-line-container-1 span',
      isInactive: notHasClass('loading-line'),
      isActive: hasClass('loading-line'),
    },

    secondLoadingLine: {
      scope: '.loading-line-container-2 span',
      isInactive: notHasClass('loading-line'),
      isActive: hasClass('loading-line'),
    }
  },

  hasTruncatedLog: isVisible('.notification-warning'),

  toggleLog: clickable('.toggle-log-button'),

  logLines: collection('pre#log .log-line', {
    entireLineText: joinTexts('span'),

    isBlack: hasClass('black', 'span:last-of-type'),
    isRed: hasClass('red', 'span:last-of-type'),
    isGreen: hasClass('green', 'span:last-of-type'),
    isYellow: hasClass('yellow', 'span:last-of-type'),
    isBlue: hasClass('blue', 'span:last-of-type'),
    isMagenta: hasClass('magenta', 'span:last-of-type'),
    isCyan: hasClass('cyan', 'span:last-of-type'),
    isWhite: hasClass('white', 'span:last-of-type'),
    isGrey: hasClass('grey', 'span:last-of-type'),

    hasBlackBackground: hasClass('bg-black', 'span:last-of-type'),
    hasRedBackground: hasClass('bg-red', 'span:last-of-type'),
    hasGreenBackground: hasClass('bg-green', 'span:last-of-type'),
    hasYellowBackground: hasClass('bg-yellow', 'span:last-of-type'),
    hasBlueBackground: hasClass('bg-blue', 'span:last-of-type'),
    hasMagentaBackground: hasClass('bg-magenta', 'span:last-of-type'),
    hasCyanBackground: hasClass('bg-cyan', 'span:last-of-type'),
    hasWhiteBackground: hasClass('bg-white', 'span:last-of-type'),

    isBolded: hasClass('bold', 'span:last-of-type'),
    isItalicised: hasClass('italic', 'span:last-of-type'),
    isUnderlined: hasClass('underline', 'span:last-of-type')
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
  deleteModalAppears: isVisible('[data-test-modal]'),
  confirmDeleteLog: clickable('button.button-delete'),

  jobNotFoundMessage: text('h2.page-title'),
});
