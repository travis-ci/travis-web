import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  model() {
    let accountCompound = this.modelFor('account');
    return accountCompound.subscription;
  },
});
