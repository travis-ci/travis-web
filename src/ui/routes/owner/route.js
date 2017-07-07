import Ember from 'ember';
import TravisRoute from "travis/src/ui/routes/basic";
import config from 'travis/config/environment';

export default TravisRoute.extend({
  deactivate() {
    return this.controllerFor('loading').set('layoutName', null);
  },

  model(params) {
    var options = {
      headers: {
        'Travis-API-Version': '3'
      }
    };
    if (this.get('auth.signedIn')) {
      options.headers.Authorization = 'token ' + (this.get('auth').token());
    }
    let { owner } = params;
    let { apiEndpoint } = config;
    let includes = '?include=organization.repositories,repository.default_branch,build.commit';
    let url = `${apiEndpoint}/owner/${owner}${includes}`;
    return Ember.$.ajax(url, options);
  },

  renderTemplate() {
    Ember.$('body').attr('id', 'owner');
    this._super(...arguments);
  },

  actions: {
    error(error, /* transition, originRoute*/) {
      let is404 = error.status === 404;
      let errorText = 'There was an error while loading data, please try again.';
      let message = is404 ? this.transitionTo('error404') : errorText;
      this.controllerFor('error').set('layoutName', 'simple');
      this.controllerFor('error').set('message', message);
      return true;
    }
  }
});
