import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';

const { service } = Ember.inject;

export default TravisRoute.extend({
  tabStates: service(),

  model() {
    let repoId = this.modelFor('repo').get('id');
    let options = {};
    return Ember.RSVP.hash({
      activeBranches: this.get('store').query('branch', {
        repoId: repoId,
        existsOnGithub: true
      }),
      deletedBranchesCount:
      Ember.$.ajax(`${config.apiEndpoint}/v3/repo/${repoId}/branches
?exists_on_gitub=false&limit=0`, options)
        .then(function (response) {
          return response['@pagination'].count;
        })
    });
  },

  activate() {
    this.controllerFor('repo').activate('branches');
  }
});
