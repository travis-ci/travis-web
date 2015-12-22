import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  setupController(controller) {
    return this.container.lookup('controller:repos').activate('owned');
  }
});
