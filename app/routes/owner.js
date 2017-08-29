import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';
import { alias } from 'ember-decorators/object/computed';
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

      if (this.get('features.proVersion') && is404 && !this.get('auth.signedIn')) {
        // TODO: once the merge happens we only need to do it for enterprise or
        // possibly only for enterprise with disabled public repositories (or
        // we could somehow unify it as well)
        //
        // The problem here is that the current behaviour on .com is that when
        // you go to any owner page and you're not logged in, you will be
        // redirected to auth page. After the merge all the owner pages will be
        // accessible (just like on GitHub).
        this.set('auth.redirected', true);
        return this.transitionTo('auth');
      } else {
        let errorText = 'There was an error while loading data, please try again.';
        let message = is404 ? this.transitionTo('error404') : errorText;
        this.controllerFor('error').set('layoutName', 'simple');
        this.controllerFor('error').set('message', message);
        return true;
      }
    }
  }
});
