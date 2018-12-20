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

  hasWaitingStates: isVisible('.job-waiting-stages-container'),
  stageOneLoading: hasClass('spinner', '.job-waiting-stages-container .stage-1-container svg'),
  stageTwoLoading: hasClass('spinner', '.job-waiting-stages-container .stage-2-container svg'),
  stageThreeLoading: hasClass('spinner', '.job-waiting-stages-container .stage-3-container svg'),
  stageOneLoaded: hasClass('stage-loaded-ring', '.job-waiting-stages-container .stage-1-container'),
  stageTwoLoaded: hasClass('stage-loaded-ring', '.job-waiting-stages-container .stage-2-container'),
  stageThreeLoaded: hasClass('stage-loaded-ring', '.job-waiting-stages-container .stage-3-container'),
  stageOneWaitingText: text('.job-waiting-stages-container .stage-1-container span.waiting-stage-1-text'),
  stageTwoWaitingText: text('.job-waiting-stages-container .stage-2-container .waiting-stage-2-text'),
  stageThreeWaitingText: text('.job-waiting-stages-container .stage-3-container .waiting-stage-3-text'),
  stageOneText: text('.job-waiting-stages-container .stage-1-message'),
  stageTwoText: text('.job-waiting-stages-container .stage-2-message'),
  stageThreeText: text('.job-waiting-stages-container .stage-3-message'),
  stageOneLoadingLineInactive: hasClass('loading-line-1', '.loading-line-container-1 span'),
  stageTwoLoadingLineInactive: hasClass('loading-line-2', '.loading-line-container-2 span'),
  stageOneLoadingLineActive: hasClass('loading-line', '.loading-line-container-1 span'),
  stageTwoLoadingLineActive: hasClass('loading-line', '.loading-line-container-2 span'),
  hasTruncatedLog: isVisible('.log-container p.warning'),

  toggleLog: clickable('.toggle-log-button'),

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
