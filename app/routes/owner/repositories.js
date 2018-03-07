import $ from 'jquery';
import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';

export default TravisRoute.extend({
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
    let includes = `?include=owner.repositories,repository.default_branch,build.commit,repository.current_build`;
    let { owner } = transition.params.owner;
    let url = `${config.apiEndpoint}/owner/${owner}${includes}`;
    return $.ajax(url, options);
  }
});
