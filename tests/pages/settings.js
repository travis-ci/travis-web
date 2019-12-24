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

  configImportsSection: {
    scope: 'section.config-import',
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

  allowConfigImports: {
    scope: 'section.settings-section .allow_config_imports.switch',

    exists: isVisible(),
    isActive: hasClass('active'),
    toggle: clickable()
  },

  buildPushes: {
    scope: 'section.settings-section .build_pushes.switch',

    isActive: hasClass('active'),
    toggle: clickable(),
    ariaChecked: attribute('aria-checked'),
    role: attribute('role')
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
    makePublic: clickable('.switch'),
    add: clickable('.add-env-form-submit')
  },

  crons: collection('.settings-list--crons .settings-cron', {
    branchName: {
      scope: '.branch-name',
      text: text('.label-align'),
      title: attribute('title'),
    },

    interval: text('.interval'),

    nextRun: {
      scope: '.next-run',
      title: attribute('title'),
    },

    lastRun: {
      scope: '.last-run',
      title: attribute('title'),
    },

    dontRunIfRecentBuildExists: {
      scope: '.dont-run-if-recent-build-exists',
      title: attribute('title'),
    },

    delete: clickable('.cron-job-delete')
  }),

  cronBranchSelect: {
    scope: '.branch-selector'
  },

  addCronSubmit: {
    scope: '.cron-form-submit',
    click: clickable()
  },

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
