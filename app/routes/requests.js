import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  setupController() {
    this._super(...arguments);
    return this.controllerFor('repo').activate('requests');
  },

  model() {
    return this.modelFor('repo').get('requests');
  },

  beforeModel() {
    const repo = this.modelFor('repo');
    if (repo && !repo.repoOwnerAllowance) {
      repo.fetchRepoOwnerAllowance.perform();
    }
  }
});
