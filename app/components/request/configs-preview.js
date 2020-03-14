import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: 'div',
  classNames: ['request-configs-preview', 'status'],

  result: service('request-config'),

  repo: reads('request.repo'),
  requestConfig: reads('result.requestConfig.config'),
  jobConfigs: reads('result.jobConfigs'),
  messages: reads('result.messages'),
  loading: reads('result.loading'),

  formattedRequestConfig: computed('requestConfig', function () {
    return JSON.stringify(this.requestConfig, null, 2);
  }),

  formattedJobConfigs: computed('jobConfigs', function () {
    return JSON.stringify(this.jobConfigs, null, 2);
  }),

  didInsertElement() {
    let id = this.get('repo.id');
    let data = this.data();
    this.result.loadConfigs.perform(id, data);
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
      config: this.config,
      type: 'api'
    };
  },
});
