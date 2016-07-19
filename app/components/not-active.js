import Ember from 'ember';
import config from 'travis/config/environment';

const { service } = Ember.inject;
const { alias } = Ember.computed;

import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  auth: service(),
  flashes: service(),

  user: alias('auth.currentUser'),

  canActivate: Ember.computed('user.pushPermissions.[]', 'repo', function () {
    let user = this.get('user');
    if (user) {
      let permissions = user.get('pushPermissions'),
        repoId = parseInt(this.get('repo.id'));

      return permissions.contains(repoId);
    } else {
      return false;
    }
  }),

  activate: task(function * () {
    const apiEndpoint = config.apiEndpoint;
    const repo = this.get('repo');
    const repoId = this.get('repo.id');

    try {
      const response = yield Ember.$.ajax(`${apiEndpoint}/v3/repo/${repoId}/enable`, {
        headers: {
          Authorization: `token ${this.get('auth').token()}`
        },
        method: 'POST'
      });

      if (response.active) {
        const pusher = this.get('pusher');

        let channel = `repo-${repoId}`;

        if (repo.get('private') || this.get('config').enterprise) {
          channel = `private-${channel}`;
        }

        pusher.subscribe(`repo-${repoId}`);

        this.get('repo').set('active', true);
        this.get('flashes').success('Repository has been successfully activated.');
      }
    } catch (e) {
      this.get('flashes').error('There was an error while trying to active the repository.');
    }
  })
});
