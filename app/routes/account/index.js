import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  redirect() {
    this.transitionTo('account.repositories');
  }
});
