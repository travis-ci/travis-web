import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads, match } from '@ember/object/computed';
import TriggerBuild from 'travis/mixins/trigger-build';
import WithConfigValidation from 'travis/mixins/components/with-config-validation';

export default Component.extend(TriggerBuild, WithConfigValidation, {
  tagName: 'div',
  classNames: ['request-configs'],
  classNameBindings: ['status', 'customized'],

  repo: reads('request.repo'),
  status: 'closed',
  closed: match('status', /closed/),
  customize: match('status', /customize/),
  preview: match('status', /preview/),
  replace: match('mergeMode', /replace/),

  customized: false,
  processing: false,

  branch: reads('request.branchName'),
  sha: reads('request.commit.sha'),
  message: reads('request.commit.message'),
  config: reads('request.apiConfig.config'),
  mergeMode: reads('request.mergeMode'), // TODO store and serve merge mode for api request configs

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
    }
  ),

  rawConfigs: computed('request.uniqRawConfigs', 'customize', function () {
    let configs = [];
    if (this.mergeMode !== 'replace') {
      configs = this.get('request.uniqRawConfigs');
    }
    if (this.customize) {
      configs = configs.reject(config => config.source.includes('api'));
    }
    return configs;
  }),

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
    } else if (this.customized) {
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
    this.set('branch', this.get('request.branchName'));
    this.set('sha', this.get('request.commit.sha'));
    this.set('message', this.get('request.commit.message'));
    this.set('config', this.get('request.apiConfig.config'));
    this.set('mergeMode', this.get('request.mergeMode'));
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
