import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';

export default TravisRoute.extend({
  deactivate() {
    return this.controllerFor('loading').set('layoutName', null);
  },

  model(params) {
    var options;
    options = {};
    if (this.get('auth.signedIn')) {
      options.headers = {
        Authorization: "token " + (this.auth.token())
      };
    }
    return $.ajax(config.apiEndpoint + ("/v3/owner/" + params.owner + "?include=organization.repositories,repository.default_branch,build.commit"), options);
  },

  beforeModel() {
    this.controllerFor('loading').set('layoutName', 'simple');
    return this._super(...arguments);
  },
  actions: {

    error(error, transition, originRoute) {
      var login, message;

      login = transition.params.owner.owner;
      message = error.status === 404 ? this.transitionTo('error404') : "There was an error while loading data, please try again.";
      this.controllerFor('error').set('layoutName', 'simple');
      this.controllerFor('error').set('message', message);
      return true;
    }
  }
});
