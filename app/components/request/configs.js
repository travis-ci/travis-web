import Component from '@ember/component';
import { computed, set } from '@ember/object';
import { equal, or, reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import truncate from 'travis/utils/computed';
import CanTriggerBuild from 'travis/mixins/components/can-trigger-build';
import TriggerBuild from 'travis/mixins/components/trigger-build';

export default Component.extend(CanTriggerBuild, TriggerBuild, {
  classNames: ['request-configs'],
  classNameBindings: ['status'],

  preview: service('request-config'),
  features: service(),

  status: 'closed',
  closed: equal('status', 'closed'),
  loading: reads('preview.loading'),
  customizing: equal('status', 'customize'),
  previewing: equal('status', 'preview'),
  submitting: reads('submitBuildRequest.isRunning'),
  replacing: equal('mergeMode', 'replace'),
  showNewConfigView: reads('features.showNewConfigView'),

  repo: reads('request.repo'),
  repoId: reads('repo.id'),
  rawConfigs: or('preview.rawConfigs', 'request.uniqRawConfigs'),
  messages: reads('preview.messages'),
  loaded: reads('preview.loaded'),

  refType: 'sha',
  sha: reads('originalSha'),
  branch: reads('originalBranch'),
  message: reads('request.commit.message'),
  // config: reads('request.apiConfig.config'),
  // mergeMode: reads('originalMergeMode'), // TODO store and serve merge mode for api request configs
  mergeMode: reads('configs.lastObject.mergeMode'),
  defaultMergeMode: 'deep_merge_append',

  originalSha: truncate('requestOrDefaultBranchSha', 7),
  originalBranch: or('requestBranch', 'repoDefaultBranch'),
  originalMergeMode: or('request.mergeMode', 'defaultMergeMode'),
  requestBranch: reads('request.branchName'),
  requestSha: reads('request.commit.sha'),
  requestOrDefaultBranchSha: or('requestSha', 'repoDefaultBranchLastCommitSha'),
  repoDefaultBranch: reads('repo.defaultBranch.name'),
  repoDefaultBranchLastCommitSha: reads('repo.defaultBranch.lastBuild.commit.sha'),

  configs: computed(function () {
    return [{ config: null, mergeMode: this.originalMergeMode }];
  }),

  ref: computed('refType', 'branch', 'sha', function () {
    return this.get(this.refType);
  }),

  didInsertElement() {
    this.load();
  },

  onTrigger(e) {
    e.toElement.blur();
    if (this.closed) {
      this.set('status', 'open');
    } else {
      this.submit();
    }
  },

  onCustomize() {
    if (this.customizing) {
      this.set('status', 'open');
      this.reset();
    } else {
      this.set('status', 'customize');
    }
  },

  onPreview() {
    if (!this.previewing) {
      this.set('status', 'preview');
      if (!this.loaded) {
        this.load();
      }
    } else if (this.customized) {
      this.set('status', 'customize');
    } else {
      this.set('status', 'open');
    }
  },

  onCancel() {
    this.set('status', 'closed');
    this.reset();
  },

  load(debounce) {
    if (this.customizing || this.previewing) {
      this.preview.loadConfigs.perform(this.repoId, this.data(), debounce);
    }
  },

  data() {
    return {
      repo: {
        slug: this.repo.get('slug'),
        private: this.repo.get('private'),
        default_branch: this.repo.get('defaultBranch.name'),
      },
      ref: this.ref,
      mode: this.mergeMode,
      configs: this.configs, // TODO this ends up being posted as '[object Object]'
      data: {
        branch: this.refType === 'branch' ? this.branch : null,
        commit_message: this.message
      },
      type: 'api'
    };
  },

  reset() {
    this.setProperties({
      customized: false,
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
    add(ix) {
      this.configs.insertAt(ix, { config: null, mergeMode: 'deep_merge_append' });
    },
    remove(ix) {
      this.configs.removeAt(ix);
    },
    update(key, value, ix) {
      if (key === 'config' || key == 'mergeMode') {
        set(this.configs[ix], key, value);
        this.load(true);
      } else {
        this.set(key, value);
        this.load();
      }
      this.set('customized', true);
    },
    submit() {
      this.submit();
    }
  }
});
