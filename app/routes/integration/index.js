import BasicRoute from 'travis/routes/basic';

export default BasicRoute.extend({
  beforeModel() {
    return this.transitionTo('/');
  }
});
