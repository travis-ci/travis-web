import Ember from 'ember';
import config from 'travis/config/environment';

const { service } = Ember.inject;
const { alias } = Ember.computed;

import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  auth: service(),
  flashes: service(),
  permissions: service(),

  user: alias('auth.currentUser'),

  canActivate: Ember.computed('repo.permissions.admin', function () {
    let repo = this.get('repo');
    if (repo) {
      return repo.get('permissions.admin');
    } else {
      return false;
    }
  }),

  activate: task(function* () {
    const apiEndpoint = config.apiEndpoint;
    const repoId = this.get('repo.id');

    try {
      const response = yield Ember.$.ajax(`${apiEndpoint}/v3/repo/${repoId}/enable`, {
        headers: {
          Authorization: `token ${this.get('auth').token()}`
        },
        method: 'POST'
      });

      if (response.active) {
        this.get('pusher').subscribe(`repo-${repoId}`);

        this.get('repo').set('active', true);
        this.get('flashes').success('Repository has been successfully activated.');
      }
    } catch (e) {
      this.get('flashes').error('There was an error while trying to activate the repository.');
    }
  }).drop()
});
