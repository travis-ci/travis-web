import {
  create,
  attribute,
  clickable,
  collection,
  hasClass,
  isPresent,
  isHidden,
  visitable,
  text
} from 'ember-cli-page-object';

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

  branchName: {
    scope: '.build-header .commit-branch',
    title: attribute('title'),
  },

  commitSha: text('.build-header .commit-commit'),
  compare: text('.build-header .commit-compare'),
  commitBranch: text('.build-header .commit-branch-url .label-align'),
  buildTabLinkIsActive: hasClass('active', '#tab_build'),
  buildTabLinkText: text('#tab_build'),

  commitDescription: {
    scope: '.commit-description',
    isFaded: hasClass('fade-commit-message'),

    title: attribute('title'),
  },

  hasNoDebugButton: isHidden('.action-button--debug', { multiple: true }),

  requiredJobs: collection('.jobs-list:eq(0) .jobs-item', jobComponent),
  allowedFailureJobs: collection('.jobs-list:eq(1) .jobs-item', jobComponent),

  stages: collection('.jobs.stage', {
    name: text('h2 .name'),
    nameEmojiTitle: attribute('title', 'h2 .emoji'),

    duration: {
      scope: '.stage-duration',
      title: attribute('title'),
    },

    isPassed: hasClass('passed', '.stage-header'),
    isFailed: hasClass('failed', '.stage-header'),

    stateTitle: attribute('title', 'h2 .state-icon-container'),

    allowFailures: { scope: 'aside' },

    jobs: collection('.jobs-item', jobComponent)
  }),

  buildNotFoundMessage: text('h2.page-title'),

  buildTab: {
    scope: '[data-test-build-matrix-tab]'
  },

  configTab: {
    scope: '[data-test-build-config-tab]',
    isDisabled: hasClass('disabled')
  },

  requestMessagesHeader: {
    scope: '.request-messages .header'
  },

  requestMessages: collection('.request-message', {
    icon: {
      scope: '.level-icon svg',
      isInfo: hasClass('icon-info'),
      isWarning: hasClass('icon-warn'),
      isError: hasClass('icon-error')
    },
    message: text('.message'),
    link: {
      scope: '[data-test-request-message-link]',
      isPresent: isPresent(),
      href: attribute('href'),
      text: text(),
    }
  }),

  config: collection('.inner-config-container', {
    codeblock: {
      scope: '[data-test-config]',
      text: text(),
      id: attribute('id'),
    },
    source: text('.header')
  }),

  jobYamlNote: {
    scope: '[data-test-job-config-note]'
  },
});
