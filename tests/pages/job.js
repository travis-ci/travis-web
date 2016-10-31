import PageObject from 'travis/tests/page-object';

let {
  visitable,
  clickable,
  collection,
  hasClass,
  isVisible,
  text
} = PageObject;

export default PageObject.create({
  visit: visitable('travis-ci/travis-web/jobs/1'),

  branch: text('.commit-branch'),
  message: text('.build-title'),
  state: text('.build-status'),
  author: text('.commit-author'),
  log: text('#log'),
  logError: text('.job-log .notice'),

  hasTruncatedLog: isVisible('.log-container p.warning'),

  toggleLog: clickable('.toggle-log-button'),

  logLines: collection({
    scope: 'pre#log',

    itemScope: 'p span:first-of-type',

    item: {
      text: text(),

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
    }
  }),

  logFolds: collection({
    scope: 'pre#log',

    itemScope: '.fold-start',

    item: {
      name: text('span.fold-name'),
      toggle: clickable('p:first-of-type'),
      isOpen: hasClass('open')
    }
  }),

  restartJob: clickable('.action-button--restart'),
  cancelJob: clickable('.action-button--cancel'),
  debugJob: clickable('.action-button--debug'),

  notification: text('p.flash-message')
});
