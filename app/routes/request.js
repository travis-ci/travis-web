import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  setupController() {
    this._super(...arguments);
    return this.controllerFor('repo').activate('request');
  },

  model(params) {
    return this.store.find('request', params.request_id);
  }
});
