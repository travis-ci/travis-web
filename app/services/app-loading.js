import Service from '@ember/service';
import { task } from 'ember-concurrency';
import config from 'travis/config/environment';
import $ from 'jquery';

export default Service.extend({
  fetchTravisStatus: task(function * () {
    const { statusPageStatusUrl: url } = config;
    if (url) {
      const response = yield $.get(url);
      if (response.status && response.status.indicator) {
        return this.set('travisStatus', response.status.indicator);
      }
    }
  }).drop()
});
