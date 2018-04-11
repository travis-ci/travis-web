import {
  create,
  attribute,
  clickable,
  collection,
  fillable,
  hasClass,
  isVisible,
  text,
  value,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable(':organization/:repo/settings'),

  autoCancellationSection: {
    scope: 'section.auto-cancellation',
    exists: isVisible()
  },

  autoCancelPushes: {
    scope: 'section.settings-section .auto_cancel_pushes.switch-rounded',

    exists: isVisible(),
    isActive: hasClass('active'),
    toggle: clickable()
  },

  autoCancelPullRequests: {
    scope: 'section.settings-section .auto_cancel_pull_requests.switch-rounded',

    exists: isVisible(),
    isActive: hasClass('active'),
    toggle: clickable()
  },

  buildOnlyWithTravisYml: {
    scope: 'section.settings-section .builds_only_with_travis_yml.switch-rounded',

    isActive: hasClass('active'),
    toggle: clickable()
  },

  buildPushes: {
    scope: 'section.settings-section .build_pushes.switch-rounded',

    isActive: hasClass('active'),
    toggle: clickable(),
    ariaChecked: attribute('aria-checked'),
    role: attribute('role')
  },

  limitConcurrentBuilds: {
    scope: 'section.settings-section .limit-concurrent-builds',

    isActive: hasClass('active', '.switch-rounded'),
    value: value('input'),
    fill: fillable('input'),
    toggle: clickable('.switch-rounded')
  },

  buildPullRequests: {
    scope: 'section.settings-section .build_pull_requests.switch-rounded',

    isActive: hasClass('active'),
    toggle: clickable()
  },

  environmentVariables: collection('.settings-list--envvars .settings-envvar', {
    name: text('.env-var-name'),
    isPublic: hasClass('is-public'),
    isNewlyCreated: hasClass('newly-created'),
    value: value('input'),

    delete: clickable('.env-var-delete')
  }),

  environmentVariableForm: {
    scope: '.form--envvar',

    fillName: fillable('input[placeholder=Name]'),
    fillValue: fillable('input[placeholder=Value]'),
    makePublic: clickable('.switch-rounded'),
    add: clickable('input[type=submit]')
  },

  crons: collection('.settings-list--crons .settings-cron', {
    branchName: text('.branch-name'),
    interval: text('.interval'),
    nextRun: text('.next-run'),
    lastRun: text('.last-run'),
    dontRunIfRecentBuildExistsText: text('.dont-run-if-recent-build-exists'),
    delete: clickable('.cron-job-delete')
  }),

  cronBranches: collection('.form--cron form select:nth(0) option'),

  sshKey: {
    scope: '.settings-sshkey',
    name: text('.ssh-key-name span'),
    fingerprint: text('.ssh-key-value span'),

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
