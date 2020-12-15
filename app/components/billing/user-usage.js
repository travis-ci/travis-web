import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Component.extend({

  subscription: null,
  account: null,

  usedUsers: reads('subscription.usedUsers'),

  usersUsageReceived: reads('account.allowance.isFulfilled'),
  usersUsageRejected: reads('account.allowance.isRejected'),
  usersUsage: computed('account.allowance.userUsage', function () {
    const userUsage = this.get('account').get('allowance').get('userUsage');
    if (userUsage === undefined) {
      return true;
    }
    return userUsage;
  }),
  pendingUserLicenses: reads('account.allowance.pendingUserLicenses')

});
