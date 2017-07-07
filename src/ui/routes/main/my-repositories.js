import TravisRoute from "travis/src/ui/routes/basic";

export default TravisRoute.extend({
  redirect() {
    if (this.get('features.dashboard')) {
      return this.transitionTo('dashboard');
    } else {
      return this.transitionTo('main.repositories');
    }
  }
});
