import { hash } from 'rsvp';
import $ from 'jquery';
import EmberObject from '@ember/object';
import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';

export default TravisRoute.extend({
  @service api: null,

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

  fetchCronJobs() {
    const repo = this.modelFor('repo');
    const canCreateCron = repo.get('permissions.create_cron');

    if (canCreateCron) {
      return EmberObject.create({
        enabled: true,
        jobs: repo.get('cronJobs')
      });
    } else {
      return EmberObject.create({
        enabled: false,
        jobs: []
      });
    }
  },

  fetchBranches() {
    const repo = this.modelFor('repo');
    return repo.get('branches.promise');
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
      return this.get('api').get(url, (data) => {
        const fingerprint = EmberObject.create({
          fingerprint: data.fingerprint
        });
        return fingerprint;
      });
    }
  },

  fetchRepositoryActiveFlag() {
    const repoId = this.modelFor('repo').get('id');
    const url = `${config.apiEndpoint}/repo/${repoId}`;
    return $.ajax(url, {
      headers: {
        Authorization: `token ${this.auth.token()}`,
        'Travis-API-Version': '3'
      }
    }).then(response => response.active);
  },

  hasPushAccess() {
    const repoId = parseInt(this.modelFor('repo').get('id'));
    return this.auth.get('currentUser').get('pushPermissionsPromise').then((permissions) => {
      const hasPushAccess = permissions.filter(p => p === repoId);
      return hasPushAccess;
    });
  },

  model() {
    return hash({
      settings: this.modelFor('repo').fetchSettings(),
      envVars: this.fetchEnvVars(),
      cronJobs: this.fetchCronJobs(),
      branches: this.fetchBranches(),
      sshKey: this.fetchSshKey(),
      customSshKey: this.fetchCustomSshKey(),
      hasPushAccess: this.hasPushAccess(),
      repositoryActive: this.fetchRepositoryActiveFlag()
    });
  }
});
