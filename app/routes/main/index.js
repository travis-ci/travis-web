import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  redirect() {
    if (this.signedIn()) {
      return this.transitionTo('main.repositories');
    } else {
      return this.transitionTo('home');
    }
  }
});
