import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  queryParams: {
    filter: {
      replace: true
    }
  },

  redirect() {
    if (!this.get('features.dashboard')) {
      return this.transitionTo('main');
    }
  },

  model() {
    return Ember.RSVP.hash({
      repos: this.store.query('repo', {
        active: true,
        withLastBuild: true,
        sort_by: 'last_build.finished_at'
      }),
      accounts: this.store.query('account', {
        all: true
      })
    });
  }
});
