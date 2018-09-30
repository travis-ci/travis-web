import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  model() {
    let requestId = this.modelFor('job').get('build.request.id');
    return this.store.findRecord('request', requestId);
  }
});
