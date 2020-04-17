import Component from '@ember/component';
import { computed } from '@ember/object';
import { equal, or, reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import truncate from 'travis/utils/computed';
import CanTriggerBuild from 'travis/mixins/components/can-trigger-build';
import TriggerBuild from 'travis/mixins/components/trigger-build';

export const STATUSES = {
  CLOSED: 'closed',
  OPEN: 'open',
  CUSTOMIZE: 'customize',
  PREVIEW: 'preview'
};

export default Component.extend(CanTriggerBuild, TriggerBuild, {
  tagName: '',

  preview: service('request-config'),
  build: service('trigger-build'),

  status: STATUSES.CLOSED,
  closed: equal('status', STATUSES.CLOSED),
  open: equal('status', STATUSES.OPEN),
  customizing: equal('status', STATUSES.CUSTOMIZE),
  previewing: equal('status', STATUSES.PREVIEW),
  loading: reads('preview.loading'),
  submitting: reads('build.submit.isRunning'),
  replacing: equal('mergeMode', 'replace'),

  request: null,
  repo: reads('request.repo'),
  repoId: reads('repo.id'),
  rawConfigs: or('preview.rawConfigs', 'request.uniqRawConfigs'),
  loaded: reads('preview.loaded'),

  sha: reads('originalSha'),
  branch: reads('originalBranch'),
  message: reads('request.commit.message'),
  config: reads('formattedApiConfig'),
  mergeMode: reads('originalMergeMode'),
  defaultMergeMode: 'deep_merge_append',

  originalSha: truncate('requestOrDefaultBranchSha', 7),
  originalBranch: or('requestBranch', 'repoDefaultBranch'),
  originalMergeMode: or('request.mergeMode', 'defaultMergeMode'),
  requestBranch: reads('request.branchName'),
  requestSha: reads('request.commit.sha'),
  requestOrDefaultBranchSha: or('requestSha', 'repoDefaultBranchLastCommitSha'),
  repoDefaultBranch: reads('repo.defaultBranch.name'),
  repoDefaultBranchLastCommitSha: reads('repo.defaultBranch.lastBuild.commit.sha'),

  didInsertElement() {
    if (this.customizing || this.previewing) {
      this.load();
    }
    this._super(...arguments);
  },

  willDestroyElement() {
    this.reset();
    this._super(...arguments);
  },

  formattedApiConfig: computed('request.apiConfig.config', function () {
    let config = this.get('request.apiConfig.config');
    try {
      config = JSON.stringify(JSON.parse(config), null, 2);
    } catch (e) {}
    if (config !== '{}') {
      return config;
    }
  }),

  onTrigger(e) {
    if (this.closed) {
      this.set('status', STATUSES.OPEN);
    } else {
      this.submitBuildRequest();
    }
  },

  onCustomize() {
    if (!this.customizing) {
      this.set('status', STATUSES.CUSTOMIZE);
      this.load();
    }
  },

  onPreview() {
    if (!this.previewing) {
      this.set('status', STATUSES.PREVIEW);
      if (!this.loaded) {
        this.load();
      }
    }
  },

  onCancel() {
    this.set('status', STATUSES.CLOSED);
    this.reset();
  },

  load(debounce) {
    const data = {
      repo: this.repo,
      message: this.message,
      branch: this.branch,
      sha: this.sha,
      mode: this.mergeMode,
      config: this.config
    };
    this.preview.loadConfigs.perform(data, debounce);
  },

  reset() {
    this.setProperties({
      branch: this.originalBranch,
      sha: this.originalSha,
      // TODO this is here only to make the component integration test happy,
      // not sure why this.request.get ever would be undefined ...
      message: this.request.get && this.request.get('commit.message'),
      mergeMode: this.originalMergeMode,
      rawConfigs: this.request.uniqRawConfigs,
      config: this.formattedApiConfig
    });
    this.preview.reset();
    this.build.reset();
  },

  submitBuildRequest() {
    this.build.submit.perform({
      repo: this.repo,
      branchName: this.branch,
      commit: { sha: this.sha },
      config: this.config,
      message: this.message,
      mergeMode: this.mergeMode
    });
  },

  actions: {
    formFieldChanged(key, value) {
      this.set(key, value);
      if (key === 'config') {
        this.load(true);
      } else {
        this.load();
      }
    },
    submit() {
      this.submitBuildRequest();
    }
  }
});
