import Ember from 'ember';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  @service auth: null,
  @service flashes: null,
  @service permissions: null,

  @alias('auth.currentUser') user: null,

  @computed('repo', 'repo.permissions.admin')
  canActivate(repo, adminPermissions) {
    if (repo) {
      return adminPermissions;
    }
    return false;
  },

  activate: task(function* () {
    const apiEndpoint = config.apiEndpoint;
    const repoId = this.get('repo.id');

    try {
      const response = yield Ember.$.ajax(`${apiEndpoint}/repo/${repoId}/activate`, {
        headers: {
          Authorization: `token ${this.get('auth').token()}`,
          'Travis-API-Version': '3'
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
