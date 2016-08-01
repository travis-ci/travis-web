import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  redirect() {
    if (this.signedIn()) {
      if (this.get('features.dashboard')) {
        return this.transitionTo('dashboard');
      } else {
        return this.transitionTo('main.repositories');
      }
    } else {
      return this.transitionTo('home');
    }
  }
});
