import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';

export default TravisRoute.extend({
  @service auth: null,
  deactivate() {
    return this.controllerFor('loading').set('layoutName', null);
  },

  model(params) {
    let options = {
      headers: {
        'Travis-API-Version': '3'
      }
    };
    if (this.get('auth.signedIn')) {
      options.headers.Authorization = `token ${this.auth.token()}`;
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

      if (!is404) {
        let message = 'There was an error while loading data, please try again.';
        this.controllerFor('error').set('layoutName', 'simple');
        this.controllerFor('error').set('message', message);
        return true;
      } else {
        error.ownerName = this.paramsFor('owner').owner;
        return true;
      }
    }
  }
});
