import Component from '@ember/component';
import { computed } from '@ember/object';
import { equal, or, reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import truncate from 'travis/utils/computed';
import CanTriggerBuild from 'travis/mixins/components/can-trigger-build';
import TriggerBuild from 'travis/mixins/components/trigger-build';

export const STATUSES = {
  CLOSED: 'closed',
  CUSTOMIZE: 'customize',
  PREVIEW: 'preview'
};

export default Component.extend(CanTriggerBuild, TriggerBuild, {
  classNames: ['request-configs'],
  classNameBindings: ['status'],

  preview: service('request-config'),
  features: service(),

  status: STATUSES.CLOSED,
  closed: equal('status', STATUSES.CLOSED),
  customizing: equal('status', STATUSES.CUSTOMIZE),
  previewing: equal('status', STATUSES.PREVIEW),
  loading: reads('preview.loading'),
  submitting: reads('submitBuildRequest.isRunning'),
  replacing: equal('mergeMode', 'replace'),
  showNewConfigView: reads('features.showNewConfigView'),

  request: null,
  repo: reads('request.repo'),
  repoId: reads('repo.id'),
  rawConfigs: or('preview.rawConfigs', 'request.uniqRawConfigs'),
  messages: reads('preview.messages'),
  loaded: reads('preview.loaded'),

  refType: 'sha',
  sha: reads('originalSha'),
  branch: reads('originalBranch'),
  message: reads('request.commit.message'),
  config: reads('request.apiConfig.config'),
  mergeMode: reads('originalMergeMode'), // TODO store and serve merge mode for api request configs
  defaultMergeMode: 'deep_merge_append',

  originalSha: truncate('requestOrDefaultBranchSha', 7),
  originalBranch: or('requestBranch', 'repoDefaultBranch'),
  originalMergeMode: or('request.mergeMode', 'defaultMergeMode'),
  requestBranch: reads('request.branchName'),
  requestSha: reads('request.commit.sha'),
  requestOrDefaultBranchSha: or('requestSha', 'repoDefaultBranchLastCommitSha'),
  repoDefaultBranch: reads('repo.defaultBranch.name'),
  repoDefaultBranchLastCommitSha: reads('repo.defaultBranch.lastBuild.commit.sha'),

  ref: computed('refType', 'branch', 'sha', function () {
    return this.get(this.refType);
  }),

  didInsertElement() {
    this.load();
  },

  onTrigger(e) {
    e.toElement.blur();
    if (this.closed) {
      this.set('status', STATUSES.OPEN);
    } else {
      this.submit();
    }
  },

  onCustomize() {
    if (!this.customizing) {
      this.set('status', STATUSES.CUSTOMIZE);
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
    if (this.customizing || this.previewing) {
      this.preview.loadConfigs.perform(this.repoId, this.data, debounce);
    }
  },

  data: computed('repo', 'ref', 'mergeMode', 'config', 'message', function () {
    return {
      repo: {
        slug: this.repo.get('slug'),
        private: this.repo.get('private'),
        default_branch: this.repo.get('defaultBranch.name'),
      },
      ref: this.ref,
      mode: this.mergeMode,
      config: this.config || '',
      data: {
        branch: this.refType === 'branch' ? this.branch : null,
        commit_message: this.message
      },
      type: 'api'
    };
  }),

  reset() {
    this.setProperties({
      refType: 'sha',
      branch: this.originalBranch,
      sha: this.originalSha,
      message: this.request.get('commit.message'),
      mergeMode: this.originalMergeMode,
      rawConfigs: this.request.uniqRawConfigs,
      config: this.request.get('apiConfig.config')
    });
    this.preview.reset();
  },

  submit() {
    this.submitBuildRequest.perform();
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
      this.submit();
    }
  }
});
