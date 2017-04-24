import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';
import Ember from 'ember';

const { service } = Ember.inject;

export default TravisRoute.extend({
  ajax: service(),
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
  },

  fetchBranches() {
    const repo = this.modelFor('repo');
    return this.store.query('branch', {
      repoId: repo.id,
      existsOnGithub: true
    });
  },

  fetchCustomSshKey() {
    if (config.endpoints.sshKey) {
      const repo = this.modelFor('repo');
      return this.store.find('ssh_key', repo.get('id')).then((function (result) {
        if (!result.get('isNew')) {
          return result;
        }
      }), function (xhr) {
        if (xhr.status === 404) {
          return false;
        }
      });
    }
  },

  fetchSshKey() {
    if (config.endpoints.sshKey) {
      const repo = this.modelFor('repo');
      return this.get('ajax').get('/repos/' + (repo.get('id')) + '/key', (data) => {
        return Ember.Object.create({
          fingerprint: data.fingerprint
        });
      });
    }
  },

  fetchRepositoryActiveFlag() {
    const repoId = this.modelFor('repo').get('id');
    const apiEndpoint = config.apiEndpoint;

    return Ember.$.ajax(apiEndpoint + '/repo/' + repoId, {
      headers: {
        Authorization: 'token ' + this.auth.token(),
        'Travis-API-Version': '3'
      }
    }).then(function (response) {
      return response.active;
    });
  },

  hasPushAccess() {
    const repoId = parseInt(this.modelFor('repo').get('id'));
    return this.auth.get('currentUser').get('pushPermissionsPromise').then(function (permissions) {
      return permissions.filter(function (item) {
        return item === repoId;
      });
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
