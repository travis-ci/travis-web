import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';

export default TravisRoute.extend({
  queryParams: {
    filter: {
      replace: true
    }
  },

  model() {
    var apiEndpoint;
    apiEndpoint = config.apiEndpoint;
    return $.ajax(apiEndpoint + '/v3/repos?repository.active=true&include=repository.default_branch,build.commit', {
      headers: {
        Authorization: 'token ' + this.auth.token()
      }
    }).then(function(response) {
      return response.repositories.filter(function(repo) {
        if (repo.default_branch) {
          return repo.default_branch.last_build;
        }
      }).map(function(repo) {
        return Ember.Object.create(repo);
      }).sortBy('default_branch.last_build.finished_at');
    });
  }
});
