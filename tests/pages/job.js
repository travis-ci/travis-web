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

    itemScope: 'p',

    item: {
      text: text('span:first-of-type'),
      isYellow: hasClass('yellow', 'span:first-of-type')
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
