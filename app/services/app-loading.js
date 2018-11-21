import Service from '@ember/service';
import { task } from 'ember-concurrency';
import config from 'travis/config/environment';
import $ from 'jquery';
import { service } from 'ember-decorators/service';

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
  @service raven: null,

  indicator: TRAVIS_STATUS.UNKNOWN,
  description: '',

  fetchTravisStatus: task(function* () {
    if (statusPageStatusUrl) {
      try {
        const { status = {} } = yield $.get(statusPageStatusUrl) || {};
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
