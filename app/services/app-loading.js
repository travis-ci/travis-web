import Service from '@ember/service';
import { task } from 'ember-concurrency';
import config from 'travis/config/environment';
import $ from 'jquery';
import { service } from 'ember-decorators/service';

export default Service.extend({
  @service raven: null,

  fetchTravisStatus: task(function* () {
    const { statusPageStatusUrl: url } = config;
    if (url) {
      try {
        const response = yield $.get(url);
        if (response.status && response.status.indicator) {
          return this.set('travisStatus', response.status.indicator);
        }
      } catch (e) {
        this.get('raven').logException(e);
        return this.set('travisStatus', 'unknown');
      }
    }
  }).drop()
});
