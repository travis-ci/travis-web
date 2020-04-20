import { hash } from 'rsvp';
import EmberObject from '@ember/object';
import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  api: service(),
  auth: service(),
  permissions: service(),
  raven: service(),
  flashes: service(),

  needsAuth: true,

  setupController(controller, model) {
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
      return this.api.get(url, { travisApiVersion: null }).then((data) => {
        const fingerprint = EmberObject.create({
          fingerprint: data.fingerprint
        });
        return fingerprint;
      }).catch(e => {
        // 404s happen regularly and are unremarkable
        if (e.status !== 404) {
          this.raven.logException(e);
        }
      });
    }
  },

  fetchRepositoryActiveFlag() {
    const repoId = this.modelFor('repo').get('id');
    return this.api.get(`/repo/${repoId}`).then(response => response.active);
  },

  beforeModel() {
    const repo = this.modelFor('repo');
    const hasPushPermission = this.permissions.hasPushPermission(repo);
    if (!hasPushPermission) {
      this.transitionTo('repo.index');
      this.flashes.error('Your permissions are insufficient to access this repository\'s settings');
    }
  },

  model() {
    const repo = this.modelFor('repo');

    return hash({
      settings: repo.fetchSettings.perform(),
      repository: repo,
      envVars: this.fetchEnvVars(),
      sshKey: this.fetchSshKey(),
      customSshKey: this.fetchCustomSshKey(),
      hasPushAccess: this.permissions.hasPushPermission(repo),
      repositoryActive: this.fetchRepositoryActiveFlag()
    });
  }
});
