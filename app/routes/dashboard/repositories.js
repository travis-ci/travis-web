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
    return this.store.query('repo', {
      limit: 7,
      active: true,
      withLastBuild: true,
      sort_by: 'default_branch.last_build:desc'
    });
  },

  afterModel(repos) {
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
  }
});
