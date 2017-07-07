import TravisRoute from "travis/src/ui/routes/basic";

export default TravisRoute.extend({
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
