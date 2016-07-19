import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';
import Ember from 'ember';

const { service } = Ember.inject;

export default TravisRoute.extend({
  ajax: service(),
  needsAuth: true,

  setupController(controller, model) {
    this._super(...arguments);
    controller.set('repo', this.modelFor('repo'));
    this.controllerFor('repo').activate('settings');
    return controller.set('concurrentBuildsLimit', !!model.settings.maximum_number_of_builds);
  },

  fetchEnvVars() {
    let repo;
    repo = this.modelFor('repo');
    return repo.get('envVars.promise');
  },

  fetchCronJobs() {
    const repo = this.modelFor('repo');
    const apiEndpoint = config.apiEndpoint;

    return Ember.$.ajax(`${apiEndpoint}/v3/repo/${repo.get('id')}`, {
      headers: {
        Authorization: `token ${this.auth.token()}`
      }
    }).then(response => {
      if (response['@permissions']['create_cron']) {
        return Ember.Object.create({
          enabled: true,
          jobs: repo.get('cronJobs')
        });
      } else {
        return Ember.Object.create({
          enabled: false,
          jobs: []
        });
      }
    });
  },

  fetchBranches() {
    let repo;
    repo = this.modelFor('repo');
    return repo.get('branches.promise');
  },

  fetchCustomSshKey() {
    let repo;
    repo = this.modelFor('repo');
    return this.store.find('ssh_key', repo.get('id')).then((result => {
      if (!result.get('isNew')) {
        return result;
      }
    }), xhr => {
      if (xhr.status === 404) {
        return false;
      }
    });
  },

  fetchSshKey() {
    let repo;
    repo = this.modelFor('repo');
    return this.get('ajax').get(`/repos/${repo.get('id')}/key`, (data) => {
      Ember.Object.create({
        fingerprint: data.fingerprint
      });
    });
  },

  fetchRepositoryActiveFlag() {
    let apiEndpoint, repoId;
    repoId = this.modelFor('repo').get('id');
    apiEndpoint = config.apiEndpoint;
    return Ember.$.ajax(`${apiEndpoint}/v3/repo/${repoId}`, {
      headers: {
        Authorization: `token ${this.auth.token()}`
      }
    }).then(response => response.active);
  },

  hasPushAccess() {
    let repoId;
    repoId = parseInt(this.modelFor('repo').get('id'));
    let promise = this.auth.get('currentUser.pushPermissionsPromise');
    return promise.then(permissions => {
      permissions.filter(item => item === repoId);
    });
  },

  model() {
    return Ember.RSVP.hash({
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
