import PageObject from 'travis/tests/page-object';

let {
  clickable,
  collection,
  hasClass,
  isHidden,
  visitable,
  text
} = PageObject;

const jobComponent = {
  state: {
    scope: '.job-state',
    isPassed: hasClass('passed'),
    isFailed: hasClass('failed')
  },
  number: text('.job-number .label-align'),
  env: text('.job-env .label-align'),
  os: {
    scope: '.job-os',
    isLinux: hasClass('linux'),
    isMacOS: hasClass('osx')
  },
  language: text('.job-lang .label-align')
};

export default PageObject.create({
  visit: visitable('travis-ci/travis-web/builds/1'),
  restartBuild: clickable('.action-button--restart'),
  cancelBuild: clickable('.action-button--cancel'),
  debugBuild: clickable('.action-button--debug'),
  notification: text('p.flash-message'),
  singleJobLogText: text('.log-body pre'),

  hasNoDebugButton: isHidden('.action-button--debug'),

  requiredJobs: collection({
    scope: '.jobs-list:eq(0)',
    itemScope: '.jobs-item',

    item: jobComponent
  }),

  allowedFailureJobs: collection({
    scope: '.jobs-list:eq(1)',
    itemScope: '.jobs-item',

    item: jobComponent
  })
});
