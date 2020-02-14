import BasicRoute from 'travis/routes/basic';

export default BasicRoute.extend({
  redirect() {
    return this.transitionTo('/');
  }
});
