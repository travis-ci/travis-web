import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  queryParams: {
    filter: {
      replace: true
    }
  },

  beforeModel() {
    if (!this.get('features.dashboard')) {
      this.transitionTo('main');
    }
  },

  model() {
    return Ember.RSVP.hash({
      repos: this.store.query('repo', {
        limit: 100,
        active: true,
        withLastBuild: true,
        sort_by: 'last_build.finished_at:desc'
      }),
      accounts: this.store.query('account', {
        all: true
      })
    });
  }
});
