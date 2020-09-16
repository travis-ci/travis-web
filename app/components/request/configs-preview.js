import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Component.extend({
  tagName: '',

  requestConfig: reads('preview.config'),
  jobConfigs: reads('preview.jobConfigs'),
  messages: reads('preview.messages'),
  loading: reads('preview.loading'),

  formattedRequestConfig: computed('requestConfig', function () {
    return JSON.stringify(this.requestConfig, null, 2);
  }),

  formattedJobConfigs: computed('jobConfigs', function () {
    const configs = this.jobConfigs || [];
    return configs.map((config) => JSON.stringify(config, null, 2));
  }),
});
