import PageObject from 'travis/tests/page-object';

let {
  clickable,
  collection,
  fillable,
  hasClass,
  isVisible,
  text,
  value,
  visitable
} = PageObject;

export default PageObject.create({
  visit: visitable(':organization/:repo/settings'),

  notification: text('p.flash-message'),

  autoCancellationSection: {
    scope: 'section.auto-cancellation',
    exists: isVisible()
  },

  autoCancelPushes: {
    scope: 'section.settings-section .auto_cancel_pushes.switch',

    exists: isVisible(),
    isActive: hasClass('active'),
    toggle: clickable()
  },

  autoCancelPullRequests: {
    scope: 'section.settings-section .auto_cancel_pull_requests.switch',

    exists: isVisible(),
    isActive: hasClass('active'),
    toggle: clickable()
  },

  buildOnlyWithTravisYml: {
    scope: 'section.settings-section .builds_only_with_travis_yml.switch',

    isActive: hasClass('active'),
    toggle: clickable()
  },

  buildPushes: {
    scope: 'section.settings-section .build_pushes.switch',

    isActive: hasClass('active'),
    toggle: clickable()
  },

  limitConcurrentBuilds: {
    scope: 'section.settings-section .limit-concurrent-builds',

    isActive: hasClass('active', '.switch'),
    value: value('input'),
    fill: fillable('input'),
    toggle: clickable('.switch')
  },

  buildPullRequests: {
    scope: 'section.settings-section .build_pull_requests.switch',

    isActive: hasClass('active'),
    toggle: clickable()
  },

  environmentVariables: collection({
    scope: '.settings-list--envvars',
    itemScope: '.settings-envvar',

    item: {
      name: text('.env-var-name'),
      isPublic: hasClass('is-public'),
      value: value('input'),

      delete: clickable('.env-var-delete')
    }
  }),

  environmentVariableForm: {
    scope: '.form--envvar',

    fillName: fillable('input[placeholder=Name]'),
    fillValue: fillable('input[placeholder=Value]'),
    makePublic: clickable('.switch'),
    add: clickable('input[type=submit]')
  },

  crons: collection({
    scope: '.settings-list--crons',
    itemScope: '.settings-cron',

    item: {
      branchName: text('.branch-name'),
      interval: text('.interval'),
      nextRun: text('.next-run'),
      lastRun: text('.last-run'),
      dontRunIfRecentBuildExistsText: text('.dont-run-if-recent-build-exists'),
      delete: clickable('.icon-trash')
    }
  }),

  sshKey: {
    scope: '.settings-sshkey',
    name: text('.ssh-key-name span:last-child'),
    fingerprint: text('.ssh-key-value span:last-child'),

    delete: clickable('.ssh-delete'),
    cannotBeDeleted: isVisible('.ssh-no-delete')
  },

  sshKeyForm: {
    scope: '.form--sshkey',

    fillDescription: fillable('input.ssh-description'),
    fillKey: fillable('textarea.ssh-value'),
    add: clickable('input[type=submit]')
  }
});
