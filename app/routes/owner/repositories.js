import $ from 'jquery';
import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';

export default TravisRoute.extend({
  @service auth: null,

  needsAuth: false,

  titleToken(model) {
    let name = model.name || model.login;
    return name;
  },

  model(params, transition) {
    let options = {
      headers: {
        'Travis-API-Version': '3'
      }
    };

    if (this.get('auth.signedIn')) {
      options.headers.Authorization = `token ${this.get('auth.token')}`;
    }

    // eslint-disable-next-line
    let includes = `?include=repository.default_branch, build.commit`;
    let { owner } = transition.params.owner;
    let url = `${config.apiEndpoint}/owner/${owner}/repos/${includes}`;
    return $.ajax(url, options);
  }
});
