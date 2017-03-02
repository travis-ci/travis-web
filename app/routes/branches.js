import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';

const { service } = Ember.inject;

export default TravisRoute.extend({
  tabStates: service(),

  model(/* params*/) {
    var allTheBranches,  options, repoId;
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

    let path = `${config.apiEndpoint}/v3/repo/${repoId}/branches`;
    let includes = 'build.commit';
    let url = `${path}?include=${includes}&exists_on_github=true`;

    return Ember.RSVP.hash({
      activeBranches: Ember.$.ajax(url, options).then(function (response) {
        allTheBranches = response.branches;
        return {
          branches: allTheBranches,
          count: response['@pagination'].count,
          limit: response['@pagination'].limit
        };
      }),
      deletedBranchesCount: Ember.$.ajax(`${config.apiEndpoint}/v3/repo/${repoId}/branches?exists_on_gitub=false&limit=1`, options).then(function (response) {
        return response['@pagination'].count;
      })
    });
  },

  activate() {
    this.controllerFor('repo').activate('branches');
  }
});
