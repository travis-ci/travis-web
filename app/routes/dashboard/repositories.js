import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  queryParams: {
    filter: {
      replace: true
    },
    offset: {
      refreshModel: true
    }
  },

  redirect() {
    if (!this.get('features.dashboard')) {
      return this.transitionTo('index');
    }
  },

  model(params) {
    return Ember.RSVP.hash({
      starredRepos: this.store.query('repo', {
        active: true,
        starred: true,
        withLastBuild: true
      }),
      repos: this.store.paginated('repo', {
        active: true,
        sort_by: 'current_build:desc',
        offset: params.offset
      }),
      accounts: this.store.query('account', {
        all: true
      })
    });
  }
});
