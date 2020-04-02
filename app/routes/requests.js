import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({

  redirect() {
    const repo = this.modelFor('repo');
    const isAdmin = repo.get('permissions.admin');
    if (!isAdmin) {
      const { provider, ownerName, vcsName } = repo;
      this.transitionTo(`/${provider}/${ownerName}/${vcsName}`);
    }
  },

  setupController() {
    this._super(...arguments);
    return this.controllerFor('repo').activate('requests');
  },

  model() {
    return this.store.query('request', {
      repository_id: this.modelFor('repo').get('id')
    });
  }
});
