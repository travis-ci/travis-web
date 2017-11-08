import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  beforeModel(transition) {
    if (!this.signedIn()) {
      this.auth.signIn();
    } else {
      this.transitionTo('/');
    }
  }
});
