import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';

let { service } = Ember.inject;

export default TravisRoute.extend({
  starredRepos: service(),

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
      starredRepos: this.get('starredRepos').fetch(),
      repos: this.store.paginated('repo', {
        active: true,
        sort_by: 'current_build:desc',
        offset: params.offset
      })
    });
  }
});
