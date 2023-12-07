import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Component.extend({

  subscription: null,
  account: null,

  usedUsers: reads('subscription.usedUsers'),
  addonUsage: reads('subscription.addonUsage.user'),

  usersUsageReceived: reads('account.allowance.isFulfilled'),
  usersUsageRejected: reads('account.allowance.isRejected'),
  usersUsage: computed('account.allowance.userUsage', 'addonUsage', function () {
    const userUsage = this.account?.allowance?.userUsage;
    if (userUsage === undefined) {
      return true;
    }
    return userUsage && (this.addonUsage.usedCredits < this.addonUsage.totalCredits);
  }),
  pendingUserLicenses: reads('account.allowance.pendingUserLicenses')

});
