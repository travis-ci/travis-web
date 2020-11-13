import Component from '@ember/component';
import { reads } from '@ember/object/computed';

export default Component.extend({

  subscription: null,
  account: null,

  usedUsers: reads('subscription.usedUsers'),

  usersUsageFulfilled: reads('account.allowance.isFulfilled'),
  usersUsage: reads('account.allowance.userUsage'),
  pendingUserLicenses: reads('account.allowance.pendingUserLicenses')

});
