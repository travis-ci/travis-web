import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  model() {
    let accountLogin = this.modelFor('account').get('login');

    // FIXME this still uses firstObject
    // also I HATE the ESLint combination of banning long lines and requiring single-line functions
    return this.store.findAll('subscription')
      .then(subscriptions =>
        subscriptions.filter(
          subscription => subscription.get('owner.login') === accountLogin).get('firstObject'));
  },
});
