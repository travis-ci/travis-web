import Component from '@ember/component';
import { computed } from '@ember/object';
import { equal, or, reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import CanTriggerBuild from 'travis/mixins/components/can-trigger-build';
import TriggerBuild from 'travis/mixins/components/trigger-build';

function truncated(property, chars) {
  return computed(property, function () {
    return this.get(property).slice(0, 7);
  });
}

export default Component.extend(CanTriggerBuild, TriggerBuild, {
  tagName: 'div',
  classNames: ['request-configs'],
  classNameBindings: ['status'],

  preview: service('request-config'),
  features: service(),
  showNewConfigView: reads('features.showNewConfigView'),

  repo: reads('request.repo'),
  repoId: reads('repo.id'),
  rawConfigs: or('preview.rawConfigs', 'request.uniqRawConfigs'),
  messages: reads('preview.messages'),
  loading: reads('preview.loading'),

  refType: 'sha',
  sha: reads('originalSha'),
  branch: reads('originalBranch'),
  message: reads('request.commit.message'),
  config: reads('request.apiConfig.config'),
  mergeMode: reads('originalMergeMode'), // TODO store and serve merge mode for api request configs
  defaultMergeMode: 'deep_merge_append',

  originalSha: truncated('requestOrDefaultBranchSha', 10),
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
      this.preview.loadConfigs.perform(this.repoId, this.data, debounce);
      this.set('loaded', true);
    }
  },

  data: computed('repo', 'ref', 'mergeMode', 'config', function () {
    return {
      repo: {
        slug: this.repo.get('slug'),
        private: this.repo.get('private'),
        default_branch: this.repo.get('defaultBranch.name'),
      },
      ref: this.ref,
      mode: this.mergeMode,
      config: this.config,
      data: {
        branch: this.branch,
        commit_message: this.message
      },
      type: 'api'
    };
  }),

  reset() {
    this.setProperties({
      customized: false,
      loaded: false,
      branch: this.originalBranch,
      sha: this.originalSha,
      message: this.request.get('commit.message'),
      mergeMode: this.originalMergeMode,
      rawConfigs: this.request.uniqRawConfigs,
      config: this.request.get('apiConfig.config')
    });
  },

  submit() {
    this.set('submitting', true);
    this.submitBuildRequest.perform();
  },

  actions: {
    formFieldChanged(key, value) {
      this.set('customized', true);
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
