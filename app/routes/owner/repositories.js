import Ember from 'ember';
import BaseRouteMixin from 'travis/mixins/base-route';
import config from 'travis/config/environment';

export default Ember.Route.extend(BaseRouteMixin, {
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
        Authorization: 'token ' + (this.auth.token())
      };
    }

    // eslint-disable-next-line
    let includes = `?include=owner.repositories,repository.default_branch,build.commit,repository.current_build`;
    let { owner } = transition.params.owner;
    let url = `${config.apiEndpoint}/v3/owner/${owner}${includes}`;
    return Ember.$.ajax(url, options);
  }
});
