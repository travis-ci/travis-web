import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads, mapBy } from '@ember/object/computed';

export default Component.extend({
  tagName: 'div',
  classNames: ['request-configs-preview'],

  requestConfig: reads('preview.requestConfig.config'),
  jobConfigs: mapBy('preview.jobConfigs', 'config'),
  messages: reads('preview.messages'),
  loading: reads('preview.loading'),

  formattedRequestConfig: computed('requestConfig', function () {
    return JSON.stringify(this.requestConfig, null, 2);
  }),

  formattedJobConfigs: computed('jobConfigs', function () {
    return JSON.stringify(this.jobConfigs, null, 2);
  }),
});
