import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({

  redirect(model) {
    const hasModel = model && model.get;
    if (hasModel && !model.get('permissions.admin')) {
      this.transitionTo('repo');
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
