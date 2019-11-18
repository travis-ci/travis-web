import { hash } from 'rsvp';
import EmberObject from '@ember/object';
import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  ajax: service(),
  api: service(),
  auth: service(),

  needsAuth: true,

  setupController: function (controller, model) {
    this._super(...arguments);
    controller.set('repo', this.modelFor('repo'));
    this.controllerFor('repo').activate('settings');
    return controller.set('concurrentBuildsLimit', !!model.settings.maximum_number_of_builds);
  },

  fetchEnvVars() {
    const repo = this.modelFor('repo');
    return repo.get('envVars.promise');
  },

  fetchCustomSshKey() {
    if (config.endpoints.sshKey) {
      const repo = this.modelFor('repo');
      return this.store.find('ssh_key', repo.get('id')).then(((result) => {
        if (!result.get('isNew')) {
          return result;
        }
      }), (xhr) => {
        if (xhr.status === 404) {
          return false;
        }
      });
    }
  },

  fetchSshKey() {
    if (config.endpoints.sshKey) {
      const repo = this.modelFor('repo');
      const url = `/repos/${repo.get('id')}/key`;
      return this.ajax.get(url, (data) => {
        const fingerprint = EmberObject.create({
          fingerprint: data.fingerprint
        });
        return fingerprint;
      });
    }
  },

  fetchRepositoryActiveFlag() {
    const repoId = this.modelFor('repo').get('id');
    return this.api.get(`/repo/${repoId}`).then(response => response.active);
  },

  hasPushAccess() {
    const repoId = parseInt(this.modelFor('repo').get('id'));
    return this.get('auth.currentUser').get('pushPermissionsPromise').then((permissions) => {
      const hasPushAccess = permissions.filter(p => p === repoId);
      return hasPushAccess;
    });
  },

  model() {
    return hash({
      settings: this.modelFor('repo').fetchSettings(),
      repository: this.modelFor('repo'),
      envVars: this.fetchEnvVars(),
      sshKey: this.fetchSshKey(),
      customSshKey: this.fetchCustomSshKey(),
      hasPushAccess: this.hasPushAccess(),
      repositoryActive: this.fetchRepositoryActiveFlag()
    });
  }
});
