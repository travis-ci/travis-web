import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';
import route from 'ember-redux/route';

export default TravisRoute.extend({
  queryParams: {
    filter: {
      replace: true
    }
  },

  redux: Ember.inject.service(),

  model() {
    let redux = this.get('redux');

    var apiEndpoint;

    apiEndpoint = config.apiEndpoint;
    return $.ajax(apiEndpoint + '/v3/repos?repository.active=true&include=repository.default_branch,build.commit', {
      headers: {
        Authorization: 'token ' + this.auth.token()
      }
    }).then(response => redux.dispatch({type: 'DESERIALIZE_REPOSITORIES', response: response}));
  }
});
