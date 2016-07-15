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
    return Ember.$.ajax(apiEndpoint + '/v3/repos?repository.active=true&include=repository.default_branch,build.commit', {
      headers: {
        Authorization: 'token ' + this.auth.token()
      }
    }).then(function(response) {
      return response.repositories.filter(function(repo) {
        if (repo) {
          return repo.current_build;
        }
      }).map(function(repo) {
        return Ember.Object.create(repo);
      });
    });
  }
});


