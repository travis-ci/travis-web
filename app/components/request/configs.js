import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { reads, equal, or } from '@ember/object/computed';
import { task, timeout } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import TriggerBuild from 'travis/mixins/trigger-build';
import WithConfigValidation from 'travis/mixins/components/with-config-validation';

export default Component.extend(TriggerBuild, WithConfigValidation, {
  tagName: 'div',
  classNames: ['request-configs'],
  classNameBindings: ['status', 'customized'],

  api: service(),
  router: service(),
  store: service(),

  customized: false,
  processing: false,

  refType: 'branch',
  status: 'closed',
  defaultMergeMode: 'deep_merge_append',

  repo: reads('request.repo'),
  loadConfigsResult: reads('loadConfigs.last.value'),
  rawConfigs: or('loadConfigsResult.rawConfigs', 'request.uniqRawConfigs'),
  errorMessages: computed(() => []),
  messages: or('loadConfigsResult.messages', 'errorMessages'),

  closed: equal('status', 'closed'),
  customize: equal('status', 'customize'),
  preview: equal('status', 'preview'),
  replace: equal('mergeMode', 'replace'),
  loading: reads('loadConfigs.isRunning'),

  message: reads('request.commit.message'),
  config: reads('request.apiConfig.config'),
  mergeMode: reads('originalMergeMode'), // TODO store and serve merge mode for api request configs

  requestSha: reads('request.commit.sha'),
  repoDefaultBranchLastCommitSha: reads('repo.defaultBranch.lastBuild.commit.sha'),
  originalSha: or('requestSha', 'repoDefaultBranchLastCommitSha'),
  sha: reads('originalSha'),

  branch: reads('originalBranch'),
  repoDefaultBranch: reads('repo.defaultBranch.name'),
  originalBranch: or('requestBranch', 'repoDefaultBranch'),
  requestBranch: reads('request.branchName'),
  originalMergeMode: or('request.mergeMode', 'defaultMergeMode'),

  isRepoConfig: equal('router.currentRouteName', 'repo.config'),

  displayTriggerBuild: computed(
    'repo.migrationStatus',
    'repo.permissions.create_request',
    'features.{enterpriseVersion,proVersion}',
    function () {
      let migrationStatus = this.get('repo.migrationStatus');
      let canTriggerBuild = this.get('repo.permissions.create_request');
      let enterprise = this.get('features.enterpriseVersion');
      let pro = this.get('features.proVersion');

      if (enterprise || pro) {
        return canTriggerBuild;
      }
      return canTriggerBuild && migrationStatus !== 'migrated';
    }),

  ref: computed('refType', 'branch', 'sha', function () {
    return this.get(this.refType);
  }),

  fieldChanged: observer('refType', 'branch', 'sha', 'mergeMode', function () {
    this.loadConfigs.perform();
  }),

  configChanged: observer('config', function () {
    this.loadConfigs.perform({ milliseconds: 500 });
  }),

  didInsertElement() {
    this.loadConfigs.perform();
  },

  getConfigsData() {
    return {
      repo: {
        slug: this.repo.get('slug'),
        private: this.repo.get('private'),
        default_branch: this.repo.get('defaultBranch.name'),
      },
      ref: this.ref,
      mode: this.mergeMode,
      config: this.config,
      type: 'api'
    };
  },

  loadConfigs: task(function* (debounce) {
    if (this.status !== 'closed' && this.status !== 'open') {
      let data = this.getConfigsData();
      if (debounce && debounce.milliseconds) {
        yield timeout(debounce.milliseconds);
      }
      try {
        return yield this.store.queryRecord('build-config', { data });
      } catch (e) {
        this.handleLoadConfigError(e);
      }
    }
  }).drop(),

  handleLoadConfigError(e) {
    if (e.json) {
      e.json().then(e => {
        this.set('errorMessages', [{ level: 'error', code: e.error_type, args: { message: e.error_message } }]);
      });
    }
  },

  // shouldn't these actually be actions, and shouldn't the template
  // use onclick={{action "triggerBuild"}} rather than
  // onclick={{action this.onTriggerBuild}}
  onTriggerBuild(e) {
    e.toElement.blur();
    if (this.status == 'closed') {
      this.set('status', 'open');
    } else if (['open', 'customize', 'preview'].includes(this.status)) {
      this.submit();
    }
  },

  onPreview() {
    if (!this.preview) {
      this.set('status', 'preview');
    } else if (this.customized || this.isRepoConfig) {
      this.set('status', 'customize');
    } else {
      this.set('status', 'open');
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

  submit() {
    this.set('processing', true);
    this.submitBuildRequest.perform();
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

  actions: {
    formFieldChanged(key, value) {
      this.set('customized', true);
      this.set(key, value);
    },
    submit() {
      this.submit();
    }
  }
});
