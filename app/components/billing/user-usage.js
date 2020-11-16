import Component from '@ember/component';
import { reads } from '@ember/object/computed';

export default Component.extend({

  subscription: null,
  account: null,

  usedUsers: reads('subscription.usedUsers'),

  usersUsageReceived: reads('account.allowance.isFulfilled'),
  usersUsageRejected: reads('account.allowance.isRejected'),
  usersUsage: reads('account.allowance.userUsage'),
  pendingUserLicenses: reads('account.allowance.pendingUserLicenses')

});
