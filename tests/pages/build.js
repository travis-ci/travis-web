import {
  create,
  attribute,
  clickable,
  collection,
  hasClass,
  isHidden,
  visitable,
  text
} from 'ember-cli-page-object';

import ymlMessages from './yml-messages';

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
    isMacOS: hasClass('osx'),
    isUnknown: hasClass('unknown')
  },
  language: text('.job-lang .label-align')
};

export default create({
  visit: visitable(':owner/:repo/builds/:build_id'),
  restartBuild: clickable('.action-button--restart'),
  cancelBuild: clickable('.action-button--cancel'),
  debugBuild: clickable('.action-button--debug'),

  singleJobLogText: text('.log-body pre'),

  branchName: text('.build-header .commit-branch'),
  commitSha: text('.build-header .commit-commit'),
  compare: text('.build-header .commit-compare'),
  commitBranch: text('.build-header .commit-branch-url span'),
  buildTabLinkIsActive: hasClass('active', '#tab_build'),
  buildTabLinkText: text('#tab_build'),

  hasNoDebugButton: isHidden('.action-button--debug', { multiple: true }),

  ymlMessages,

  requiredJobs: collection('.jobs-list:eq(0) .jobs-item', jobComponent),
  allowedFailureJobs: collection('.jobs-list:eq(1) .jobs-item', jobComponent),

  stages: collection('.jobs.stage', {
    name: text('h2 .name'),
    nameEmojiTitle: attribute('title', 'h2 .emoji'),
    duration: text('.stage-duration'),

    isPassed: hasClass('passed', '.stage-header'),
    isFailed: hasClass('failed', '.stage-header'),

    stateTitle: attribute('title', 'h2 .state-icon-container'),

    allowFailures: { scope: 'aside' },

    jobs: collection('.jobs-item', jobComponent)
  }),

  buildNotFoundMessage: text('h2.page-title'),
});
