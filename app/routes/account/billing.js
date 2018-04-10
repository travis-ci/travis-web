import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  model() {
    // FIXME this needs to filter to find the subscription for the current account
    return this.store.findAll('subscription')
      .then(subscriptions => subscriptions.get('firstObject'));
  },
});
