import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  redirect() {
    return this.transitionTo("main.repositories");
  }
});
