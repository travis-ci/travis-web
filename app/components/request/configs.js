import Component from '@ember/component';
import { computed, set } from '@ember/object';
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

  preview: service('request-preview'),
  build: service('trigger-build'),
  store: service(),

  status: STATUSES.CLOSED,
  closed: equal('status', STATUSES.CLOSED),
  open: equal('status', STATUSES.OPEN),
  customizing: equal('status', STATUSES.CUSTOMIZE),
  previewing: equal('status', STATUSES.PREVIEW),
  loading: reads('preview.loading'),
  submitting: reads('build.submit.isRunning'),

  request: null,
  repo: reads('request.repo'),
  repoId: reads('repo.id'),
  rawConfigs: or('preview.rawConfigs', 'request.uniqRawConfigs'),
  loaded: reads('preview.loaded'),

  sha: or('customSha', 'originalSha'),
  branch: or('customBranch', 'originalBranch'),
  message: or('customMessage', 'branchMessage', 'request.commit.message'),

  originalSha: truncate('requestOrBranchSha', 7),
  originalBranch: or('requestBranch', 'repoDefaultBranch'),
  originalMergeMode: or('request.mergeMode', 'defaultMergeMode'),
  requestBranch: reads('request.branchName'),
  requestSha: reads('request.commit.sha'),
  requestOrBranchSha: or('branchSha', 'requestSha', 'repoDefaultBranchLastCommitSha'),
  repoDefaultBranch: reads('repo.defaultBranch.name'),
  repoDefaultBranchLastCommitSha: reads('repo.defaultBranch.lastBuild.commit.sha'),
  defaultMergeMode: 'deep_merge_append',

  configs: computed(function () {
    return [{ config: this.formattedApiConfig, mergeMode: this.originalMergeMode }];
  }),

  didInsertElement() {
    if (this.customizing || this.previewing) {
      this.loadPreview();
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
      this.loadPreview();
    }
  },

  onPreview() {
    if (!this.previewing) {
      this.set('status', STATUSES.PREVIEW);
      if (!this.loaded) {
        this.loadPreview();
      }
    }
  },

  onCancel() {
    this.set('status', STATUSES.CLOSED);
    this.reset();
  },

  loadSha() {
    this.store.findRecord('branch', `/repo/${this.repo.get('id')}/branch/${this.branch}`).then(branch => {
      branch.get('lastBuild').then(build => {
        this.set('customSha', null);
        this.set('branchSha', build.get('commit.sha'));
        this.set('branchMessage', build.get('commit.message'));
      });
    });
  },

  loadPreview(debounce) {
    const data = {
      repo: this.repo,
      message: this.message,
      branch: this.branch,
      sha: this.sha !== '' ? this.sha : null,
      configs: this.configs
    };
    this.preview.loadConfigs.perform(data, debounce);
  },

  reset() {
    this.setProperties({
      customBranch: null,
      customSha: null,
      customMessage: null,
      branchSha: null,
      // TODO these conditionals are here only to make the tests happy,
      // not sure why this.request.get ever would be undefined ...
      message: this.request && this.request.get && this.request.get('commit.message'),
      rawConfigs: this.request && this.request.uniqRawConfigs,
      configs: [{ config: this.formattedApiConfig, mergeMode: this.originalMergeMode }]
    });
    this.preview.reset();
    this.build.reset();
  },

  submitBuildRequest() {
    if (this.sha) {
      this.build.submit.perform({
        repo: this.repo,
        branchName: this.branch,
        commit: { sha: this.sha },
        message: this.message,
        configs: this.configs,
      });
    } else {
      this.set('invalid', true);
      setTimeout(() => this.set('invalid', false), 1500);
    }
  },

  actions: {
    add(ix) {
      this.configs.insertAt(ix + 1, { config: null, mergeMode: 'deep_merge_append' });
    },
    remove(ix) {
      this.configs.removeAt(ix);
    },
    update(key, ix, value) {
      let debounce = false;
      if (key === 'config' || key == 'mergeMode') {
        set(this.configs[ix], key, value);
        debounce = true;
      } else if (key === 'branch') {
        this.set('customBranch', value);
        this.loadSha();
      } else if (key === 'sha') {
        this.set('customSha', value);
      } else if (key === 'message') {
        this.set('customMessage', value);
      } else {
        throw `unknown field ${key}`;
      }
      this.loadPreview(debounce);
      this.set('customized', true);
    },
    submit() {
      this.submitBuildRequest();
    }
  }
});
