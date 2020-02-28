import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { reads, equal, or } from '@ember/object/computed';
// import { debounce } from '@ember/runloop';
import { task } from 'ember-concurrency';
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
  rawConfigs: reads('request.uniqRawConfigs'),
  closed: equal('status', 'closed'),
  customize: equal('status', 'customize'),
  preview: equal('status', 'preview'),
  replace: equal('mergeMode', 'replace'),
  loading: reads('load.isRunning'),

  branch: reads('originalBranch'),
  sha: reads('originalSha'),
  message: reads('request.commit.message'),
  config: reads('request.apiConfig.config'),
  mergeMode: reads('originalMergeMode'), // TODO store and serve merge mode for api request configs

  originalBranch: or('requestBranch', 'repoDefaultBranch'),
  originalSha: or('requestSha', 'repoDefaultBranchLastCommitSha'),
  originalMergeMode: or('request.mergeMode', 'defaultMergeMode'),
  isOriginalBranch: equal('branch', 'originalBranch'),
  isOriginalSha: equal('sha', 'originalSha'),

  requestBranch: reads('request.branchName'),
  repoDefaultBranch: reads('repo.defaultBranch.name'),
  requestSha: reads('request.commit.sha'),
  repoDefaultBranchLastCommitSha: reads('repo.defaultBranch.lastBuild.commit.sha'),

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

  branchChanged: observer('branch', function () {
    if (!this.isOriginalBranch && this.sha === this.originalSha) {
      this.set('sha', '');
    } else if (this.branch === this.originalBranch && !this.sha) {
      this.set('sha', this.originalSha);
    }
  }),

  shaChanged: observer('sha', function () {
    if (this.sha && !this.isOriginalSha) {
      this.set('branch', undefined);
    }
  }),

  fieldChanged: observer('refType', 'branch', 'sha', 'mergeMode', function () {
    this.load.perform();
  }),

  // configChanged: observer('config', function () {
  //   debounce(this, 'load', 500);
  // }),

  didInsertElement() {
    this.load.perform();
  },

  load: task(function* () {
    if (this.status !== 'closed' && this.status !== 'open') {
      let data = {
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
      try {
        const result = yield this.store.queryRecord('build-config', { data });
        this.set('rawConfigs', result.rawConfigs);
        this.set('messages', result.messages);
      } catch (e) {
        this.set('rawConfigs', []);
        this.set('messages', [{ level: 'error', code: e.error_type, args: { message: e.error_message } }]);
      }
    }
  }).drop(),

  // shouldn't these actually be actions, and shouldn't the template
  // use onclick={{action "triggerBuild"}} rather than
  // onclick={{action this.onTriggerBuild}}
  onTriggerBuild(e) {
    e.toElement.blur();
    if (this.status == 'closed') {
      this.set('status', 'open');
    } else if (this.status == 'open' || this.status == 'customize' || this.status == 'preview') {
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
    this.set('customized', false);
    this.set('branch', this.originalBranch);
    this.set('sha', this.originalSha);
    this.set('message', this.request.get('commit.message'));
    this.set('mergeMode', this.originalMergeMode);
    this.set('rawConfigs', this.request.uniqRawConfigs);
    this.set('config', this.request.get('apiConfig.config'));
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
