import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';

export default TravisRoute.extend({
  model(params) {
    var allTheBranches, apiEndpoint, options, repoId;
    apiEndpoint = config.apiEndpoint;
    repoId = this.modelFor('repo').get('id');
    allTheBranches = Ember.ArrayProxy.create();
    options = {};
    if (this.get('auth.signedIn')) {
      options.headers = {
        Authorization: "token " + (this.auth.token())
      };
    }
    return $.ajax(apiEndpoint + "/v3/repo/" + repoId + "/branches?include=build.commit&limit=100", options).then(function(response) {
      allTheBranches = response.branches;
      return allTheBranches;
    });
  },

  activate() {
    $('.tab.tabs--main li').removeClass('active');
    return $('#tab_branches').addClass('active');
  },

  deactivate() {
    return $('#tab_branches').removeClass('active');
  }
});
