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
    let apiEndpoint;
    apiEndpoint = config.apiEndpoint;
    let queryParams = '?repository.active=true&include=repository.default_branch,build.commit';
    let url = `${apiEndpoint}/v3/repos${queryParams}`;
    return Ember.$.ajax(url, {
      headers: {
        Authorization: `token ${this.auth.token()}`
      }
    }).then(response => response.repositories.filter(repo => {
      if (repo) {
        return repo.current_build;
      }
    }).map(repo => Ember.Object.create(repo)));
  }
});
