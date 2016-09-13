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
    options = {};
    if (this.get('auth.signedIn')) {
      options.headers = {
        Authorization: 'token ' + (this.auth.token())
      };
    }

    let path = `${apiEndpoint}/v3/repo/${repoId}/branches`;
    let includes = 'build.commit&limit=100';
    let url = `${path}?include=${includes}`;

    return Ember.$.ajax(url, options).then(function (response) {
      allTheBranches = response.branches;
      return allTheBranches;
    });
  },

  activate() {
    this.controllerFor('repo').activate('branches');
  }
});
