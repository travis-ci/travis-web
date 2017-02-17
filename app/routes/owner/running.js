import Ember from 'ember';
import BaseRouteMixin from 'travis/mixins/base-route';
import config from 'travis/config/environment';

export default Ember.Route.extend(BaseRouteMixin, {
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
