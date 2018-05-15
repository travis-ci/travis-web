import TravisRoute from 'travis/routes/basic';
import { service } from 'ember-decorators/service';

export default TravisRoute.extend({
  @service raven: null,

  model() {
    let accountCompound = this.modelFor('account');
    return accountCompound.account.get('subscription');
  },
});
