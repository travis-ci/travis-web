import $ from 'jquery';
import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  auth: service(),
  deactivate() {
    return this.controllerFor('loading').set('layoutName', null);
  },

  titleToken(model) {
    let name = model.name || model.login;
    return name;
  },

  model(params) {
    let options = {
      headers: {
        'Travis-API-Version': '3'
      }
    };
    if (this.get('auth.signedIn')) {
      options.headers.Authorization = `token ${this.get('auth.token')}`;
    }
    let { owner } = params;
    let { apiEndpoint } = config;
    let url = `${apiEndpoint}/owner/${owner}`;
    return $.ajax(url, options);
  },

  renderTemplate() {
    $('body').attr('id', 'owner');
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
