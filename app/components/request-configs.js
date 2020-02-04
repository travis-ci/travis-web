import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads, match } from '@ember/object/computed';
import TriggerBuild from 'travis/mixins/trigger-build';

export default Component.extend(TriggerBuild, {
  tagName: 'div',
  classNames: ['request-configs'],
  classNameBindings: ['status'],

  repo: reads('request.repo'),
  status: 'closed',
  closed: match('status', /closed/),
  customize: match('status', /customize/),
  replace: match('mergeMode', /replace/),
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

  rawConfigs: computed('request.rawConfigs', 'customize', function () {
    let configs = this.get('request.uniqRawConfigs');
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
    } else if (this.status == 'open' || this.status == 'customize') {
      this.set('processing', true);
      this.submitBuildRequest.perform();
    }
  },

  onCustomize() {
    if (this.status == 'open') {
      this.set('status', 'customize');
    } else if (this.status == 'customize') {
      this.set('status', 'open');
    }
  },

  onCancel() {
    if (this.status == 'open' || this.status == 'customize') {
      this.set('status', 'closed');
    }
  },

  actions: {
    formFieldChanged(key, value) {
      this.set(key, value);
    }
  }
});
