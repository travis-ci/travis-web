import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';

export default TravisRoute.extend({
  needsAuth: false,

  titleToken(model) {
    var name = model.name || model.login;
    return name;
  },

  model(params, transition) {
    var options;
    options = {};

    if (this.get('auth.signedIn')) {
      options.headers = {
        Authorization: "token " + (this.auth.token())
      };
    }

    return $.ajax(config.apiEndpoint + ("/v3/owner/" + transition.params.owner.owner + "?include=owner.repositories,repository.default_branch,build.commit"), options).then(function(response) {
      return response;
    });
  }
});
