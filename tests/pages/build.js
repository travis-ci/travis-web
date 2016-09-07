import PageObject from 'travis/tests/page-object';

let {
  clickable,
  collection,
  hasClass,
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
  os: text('.job-os span'),
  language: text('.job-lang .label-align')
};

export default PageObject.create({
  visit: visitable('travis-ci/travis-web/builds/1'),
  restartBuild: clickable('.action-button--restart'),
  cancelBuild: clickable('.action-button--cancel'),
  restartedNotification: text('p.flash-message'),
  cancelledNotification: text('p.flash-message'),
  singleJobLogText: text('.log-body pre'),

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
