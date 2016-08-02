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
    const repos = this.store.query('repo', { active: true, withLastBuild: true });
    
    return repos;
  }
});
