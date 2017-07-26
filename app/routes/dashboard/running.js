import Ember from 'ember';
let { service } = Ember.inject;

export default Ember.Route.extend({
  starredRepos: service(),
  auth: service(),

  redirect() {
    if (!this.get('features.dashboard')) {
      return this.transitionTo('index');
    }
  },

  model(params) {
    return Ember.RSVP.hash({
      starredRepos: this.get('starredRepos').fetch(),
      runningJobs: this.store.query('job', {
        runningOnly: true,
        owner: this.auth.get('currentUser.login')
      })
    });
  }
});
