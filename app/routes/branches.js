import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';

const { service } = Ember.inject;

export default TravisRoute.extend({
  tabStates: service(),

  model(/* params*/) {
    var allTheBranches, apiEndpoint, options, repoId;
    apiEndpoint = config.apiEndpoint;
    repoId = this.modelFor('repo').get('id');
    allTheBranches = Ember.ArrayProxy.create();
    options = {
      headers: {
        'Travis-API-Version': '3'
      }
    };
    if (this.get('auth.signedIn')) {
      options.headers.Authorization = 'token ' + (this.auth.token());
    }

    let path = `${apiEndpoint}/v3/repo/${repoId}/branches`;
    let includes = 'build.commit';
    let url = `${path}?include=${includes}&exists_on_github=true`;

    return Ember.$.ajax(url, options).then(function (response) {
      allTheBranches = response.branches;
      return allTheBranches;
    });
  },

  activate() {
    this.controllerFor('repo').activate('branches');
  }
});
