import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads, or } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: 'div',
  classNames: ['request-configs-preview', 'status'],

  yml: service(),

  repo: reads('request.repo'),
  rawConfigs: or('yml.rawConfigs', 'request.uniqRawConfigs'),
  requestConfig: reads('yml.requestConfig'),
  jobConfigs: reads('yml.jobConfigs'),
  messages: reads('yml.messages'),
  loading: reads('yml.loading'),

  formattedRequestConfig: computed('requestConfig', function () {
    return JSON.stringify(this.requestConfig, null, 2);
  }),

  formattedJobConfigs: computed('jobConfigs', function () {
    return JSON.stringify(this.jobConfigs, null, 2);
  }),

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

  didInsertElement() {
    let id = this.get('repo.id');
    let data = this.getConfigsData();
    this.yml.loadConfigs.perform(id, data);
  },
});
