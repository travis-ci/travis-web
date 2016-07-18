import PageObject from 'travis/tests/page-object';

let {
  clickable,
  collection,
  hasClass,
  visitable,
  text
} = PageObject;

export default PageObject.create({
  visit: visitable('travis-ci/travis-web/builds/1'),
  restartBuild: clickable('.button-circle-trigger'),
  cancelBuild: clickable('.button-circle-cancel'),
  restartedNotification: text('p.flash-message'),
  cancelledNotification: text('p.flash-message'),
  singleJobLogText: text('.log-body pre'),

  jobs: collection({
    scope: '.jobs-list',
    itemScope: '.jobs-item',

    item: {
      state: {
        scope: '.job-state',
        isPassed: hasClass('passed'),
        isFailed: hasClass('failed')
      },

      number: {
        scope: '.job-number',
        text: text('.label-align')
      },

      env: text('.job-env .label-align')
    }
  })
});
