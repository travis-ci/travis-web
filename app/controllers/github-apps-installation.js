import Controller from '@ember/controller';

import { fetch, Headers } from 'fetch';
import { service } from 'ember-decorators/service';
import config from 'travis/config/environment';
import { later } from '@ember/runloop';
import { Promise as EmberPromise } from 'rsvp';

const interval = config.intervals.githubAppsInstallationPolling;

export default Controller.extend({
  @service auth: null,
  @service raven: null,

  queryParams: ['installation_id'],

  repetitions: 0,
  maxRepetitions: 10,

  startPolling() {
    this.initialDelayPromise().then(() => this.fetchPromise().then(installation => {
      this.transitionToRoute('account');
    }));
  },

  initialDelayPromise() {
    return new Promise(((resolve) => {
      setTimeout(resolve.bind(null), interval);
    }));
  },

  fetchPromise() {
    let headers = new Headers({
      'Authorization': `token ${this.get('auth.token')}`,
      'Travis-API-Version': '3'
    });

    let url = `${config.apiEndpoint}/installation/` +
      `${this.get('installation_id')}?include=installation.owner`;

    return fetch(url, {headers}).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        let repetitions = this.get('repetitions');
        let maxRepetitions = this.get('maxRepetitions');

        if (repetitions < maxRepetitions) {
          this.set('repetitions', repetitions + 1);
          return new EmberPromise(resolve => later(() => resolve(this.fetchPromise()), interval));
        } else {
          let exception =
            new Error(`Timed out looking for owner of installation ${this.get('installation_id')}`);
          this.get('raven').logException(exception, true);
        }
      }
    });
  }
});
