import Service, { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import config from 'travis/config/environment';

const { statusPageStatusUrl } = config;

export const TRAVIS_STATUS = {
  UNKNOWN: 'unknown',
  NONE: 'none',
  MAINTENANCE: 'maintenance',
  DEGRADED: 'degraded',
  MINOR: 'minor',
  MAJOR: 'major'
};

export default Service.extend({
  api: service(),
  raven: service(),

  indicator: TRAVIS_STATUS.UNKNOWN,
  description: '',

  fetchTravisStatus: task(function* () {
    if (statusPageStatusUrl) {
      try {
        const { status = {} } = yield this.api.get(statusPageStatusUrl, {
          host: '',
          travisApiVersion: false
        }) || {};

        const { indicator, description } = status;
        if (indicator || description) {
          this.setProperties({ indicator, description });
        }
      } catch (e) {
        this.raven.logException(e);
      }
    }
  }).drop()
});
