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

  requestConfig: service(),
  features: service(),

  status: 'closed',
  closed: equal('status', 'closed'),
  customizing: equal('status', 'customize'),
  previewing: equal('status', 'preview'),
  replacing: equal('mergeMode', 'replace'),
  showNewConfigView: reads('features.showNewConfigView'),

  repo: reads('request.repo'),
  rawConfigs: or('requestConfig.rawConfigs', 'request.uniqRawConfigs'),
  messages: reads('requestConfig.messages'),
  loading: reads('requestConfig.loading'),

  refType: 'sha',
  sha: truncated('originalSha', 10),
  branch: reads('originalBranch'),
  message: reads('request.commit.message'),
  config: reads('request.apiConfig.config'),
  mergeMode: reads('originalMergeMode'), // TODO store and serve merge mode for api request configs
  defaultMergeMode: 'deep_merge_append',

  originalSha: or('requestSha', 'repoDefaultBranchLastCommitSha'),
  originalBranch: or('requestBranch', 'repoDefaultBranch'),
  originalMergeMode: or('request.mergeMode', 'defaultMergeMode'),
  requestBranch: reads('request.branchName'),
  requestSha: reads('request.commit.sha'),
  repoDefaultBranch: reads('repo.defaultBranch.name'),
  repoDefaultBranchLastCommitSha: reads('repo.defaultBranch.lastBuild.commit.sha'),

  onTriggerBuild(e) {
    e.toElement.blur();
    if (this.status == 'closed') {
      this.set('status', 'open');
    } else if (['open', 'customize', 'preview'].includes(this.status)) {
      this.submit();
    }
  },

  onCustomize() {
    if (this.status == 'customize') {
      this.set('status', 'open');
      this.reset();
    } else {
      this.set('status', 'customize');
    }
  },

  onCancel() {
    this.set('status', 'closed');
    this.reset();
  },

  reset() {
    this.setProperties({
      customized: false,
      branch: this.originalBranch,
      sha: this.originalSha,
      message: this.request.get('commit.message'),
      mergeMode: this.originalMergeMode,
      rawConfigs: this.request.uniqRawConfigs,
      config: this.request.get('apiConfig.config')
    });
  },

  submit() {
    this.set('processing', true);
    this.submitBuildRequest.perform();
  },

  actions: {
    formFieldChanged(key, value) {
      this.set('customized', true);
      this.set(key, value);
      if (key === 'config') {
        this.loadConfigs(true);
      } else {
        this.loadConfigs();
      }
    },
    submit() {
      this.submit();
    }
  }
});
