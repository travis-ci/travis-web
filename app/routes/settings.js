import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';
import Ember from 'ember';

const { service } = Ember.inject;

export default TravisRoute.extend({
  ajax: service(),
  needsAuth: true,

  setupController: function(controller, model) {
    this._super(...arguments);
    controller.set('repo', this.modelFor('repo'));
    this.controllerFor('repo').activate('settings');
    return controller.set('concurrentBuildsLimit', !!model.settings.maximum_number_of_builds);
  },

  fetchEnvVars() {
    var repo;
    repo = this.modelFor('repo');
    return repo.get('envVars.promise');
  },

  fetchCronJobs() {
    var repo = this.modelFor('repo');
    var apiEndpoint = config.apiEndpoint;

    return $.ajax(apiEndpoint + "/v3/repo/" + repo.get('id'), {
      headers: {
        Authorization: 'token ' + this.auth.token()
      }
    }).then(function(response) {
      if(response["@permissions"]["create_cron"]) {
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
    var repo;
    repo = this.modelFor('repo');
    return repo.get('branches.promise');
  },

  fetchCustomSshKey() {
    var repo, self;
    repo = this.modelFor('repo');
    self = this;
    return this.store.find('ssh_key', repo.get('id')).then((function(result) {
      if (!result.get('isNew')) {
        return result;
      }
    }), function(xhr) {
      if (xhr.status === 404) {
        return false;
      }
    });
  },

  fetchSshKey() {
    var repo;
    repo = this.modelFor('repo');
    return this.get('ajax').get("/repos/" + (repo.get('id')) + "/key", (data) => {
      return Ember.Object.create({
        fingerprint: data.fingerprint
      });
    });
  },

  fetchRepositoryActiveFlag() {
    var apiEndpoint, repoId;
    repoId = this.modelFor('repo').get('id');
    apiEndpoint = config.apiEndpoint;
    return $.ajax(apiEndpoint + "/v3/repo/" + repoId, {
      headers: {
        Authorization: 'token ' + this.auth.token()
      }
    }).then(function(response) {
      return response.active;
    });
  },

  hasPushAccess() {
    var repoId;
    repoId = parseInt(this.modelFor('repo').get('id'));
    return this.auth.get('currentUser').get('pushPermissionsPromise').then(function(permissions) {
      return permissions.filter(function(item) {
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
