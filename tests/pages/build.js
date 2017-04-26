import PageObject from 'travis/tests/page-object';

let {
  attribute,
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
  visit: visitable(':slug/builds/:build_id'),
  restartBuild: clickable('.action-button--restart'),
  cancelBuild: clickable('.action-button--cancel'),
  debugBuild: clickable('.action-button--debug'),
  notification: text('p.flash-message'),
  singleJobLogText: text('.log-body pre'),

  branchName: text('.build-header .commit-branch'),
  commitSha: text('.build-header .commit-commit'),
  compare: text('.build-header .commit-compare'),
  commitBranch: text('.build-header .commit-branch-url'),
  buildTabLinkIsActive: hasClass('active', '#tab_build'),
  buildTabLinkText: text('#tab_build'),

  hasNoDebugButton: isHidden('.action-button--debug', { multiple: true }),

  requiredJobs: collection({
    scope: '.jobs-list:eq(0)',
    itemScope: '.jobs-item',

    item: jobComponent
  }),

  allowedFailureJobs: collection({
    scope: '.jobs-list:eq(1)',
    itemScope: '.jobs-item',

    item: jobComponent
  }),

  stages: collection({
    itemScope: '.jobs.stage',

    item: {
      name: text('h2 .name'),
      nameEmojiTitle: attribute('title', 'h2 .emoji'),
      duration: text('.stage-duration'),

      isPassed: hasClass('passed', '.stage-header'),
      isFailed: hasClass('failed', '.stage-header'),

      stateTitle: attribute('title', 'h2 .state-icon-container'),

      allowFailures: { scope: 'aside' },

      jobs: collection({
        itemScope: '.jobs-item',

        item: jobComponent
      })
    }
  })
});
