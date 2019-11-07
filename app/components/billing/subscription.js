import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';

export default Component.extend({
  plan: service(),

  account: null,
  newSubscriptionProcess: false,

  subscription: reads('account.subscription'),
  plans: reads('plan.plans')
});
