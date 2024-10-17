import Controller from '@ember/controller';

import { fetch, Headers } from 'fetch';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';
import { later } from '@ember/runloop';
import { Promise as EmberPromise } from 'rsvp';
import { reads } from '@ember/object/computed';

const interval = config.intervals.githubAppsInstallationPolling;

export default Controller.extend({
  router: service(),
  auth: service(),
  raven: service(),
  localStorage: service('storage'),
  storage: reads('localStorage.auth'),

  queryParams: ['installation_id'],

  repetitions: 0,
  maxRepetitions: 10,

  startPolling() {
    let isSignup = false;
    if (!this.installation_id) {
      let data = this.storage.get('activeAccountInstallation');
      if (data) {
        this.installation_id = data;
        isSignup = true;
      }
      this.storage.set('activeAccountInstallation', null);
    } else {
      let data = this.storage.get('activeAccountInstallation');
      if (data) {
        isSignup = true;
        this.storage.set('activeAccountInstallation', null);
      }
    }
    this.initialDelayPromise().then(() => this.fetchPromise().then(() => {
      this.router.transitionTo(isSignup ? 'first_sync' : 'account');
    }));
  },

  initialDelayPromise() {
    return new Promise(((resolve) => {
      setTimeout(resolve.bind(null), interval);
    }));
  },

  fetchPromise() {
    let headers = new Headers({
      'Authorization': `token ${this.get('auth.webToken')}`,
      'Travis-API-Version': '3'
    });

    let url = `${config.apiEndpoint}/installation/` +
      `${this.installation_id}?include=installation.owner`;

    return fetch(url, {headers}).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        let repetitions = this.repetitions;
        let maxRepetitions = this.maxRepetitions;

        if (repetitions < maxRepetitions) {
          this.set('repetitions', repetitions + 1);
          return new EmberPromise(resolve => later(() => resolve(this.fetchPromise()), interval));
        } else {
          let exception =
            new Error(`Timed out looking for owner of installation ${this.installation_id}`);
          this.raven.logException(exception, true);
        }
      }
    });
  }
});
