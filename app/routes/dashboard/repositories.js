import Ember from 'ember';
import BaseRouteMixin from 'travis/mixins/base-route';
import config from 'travis/config/environment';

export default Ember.Route.extend(BaseRouteMixin, {
  queryParams: {
    filter: {
      replace: true
    }
  },

  model() {
    var apiEndpoint;
    apiEndpoint = config.apiEndpoint;
    let queryParams = '?repository.active=true&include=repository.default_branch,build.commit';
    let url = `${apiEndpoint}/v3/repos${queryParams}`;
    return Ember.$.ajax(url, {
      headers: {
        Authorization: 'token ' + this.auth.token()
      }
    }).then(function (response) {
      return response.repositories.filter(function (repo) {
        if (repo) {
          return repo.current_build;
        }
      }).map(function (repo) {
        return Ember.Object.create(repo);
      });
    });
  }
});
