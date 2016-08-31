import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';

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
        limit: 15,
        active: true,
        withLastBuild: true,
        sort_by: 'default_branch.last_build:desc'
      }),
      accounts: this.store.query('account', {
        all: true
      })
    });
  },

  afterModel(repos) {
    /*
    const store = this.get('store');
    return repos.map(function (item) {
      let repo = item;
      store.query('build', {
        repository_id: repo.get('id'),
        limit: 10
      }).then(function(response) {
        repo.set('lastBuilds', response.builds);
      });
      return repo;
    });
    */
  }
});
