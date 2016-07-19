import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';

export default TravisRoute.extend({
  needsAuth: false,

  titleToken(model) {
    return '' + model.name;
  },

  model(params, transition) {
    let includes =
      '?include=user.repositories,organization.repositories,build.commit,repository.active';
    let { owner } = transition.params.owner;
    return Ember.$.get(`${config.apiEndpoint}/v3/owner/${owner}${includes}`);
  }
});
