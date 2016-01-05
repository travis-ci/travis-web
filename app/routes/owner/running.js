import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';

export default TravisRoute.extend({
  needsAuth: false,

  titleToken(model) {
    return "" + model.name;
  },

  model(params, transition) {
    return $.get(config.apiEndpoint + ("/v3/owner/" + transition.params.owner.owner + "?include=user.repositories,organization.repositories,build.commit,repository.active"));
  }
});
