import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  queryParams: {
    filter: {
      replace: true
    }
  },

  model() {
    let repos = this.store.query('repo', { active: true });
    return repos;
  }
});
