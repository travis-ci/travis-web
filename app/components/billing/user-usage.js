import Component from '@ember/component';
import { reads } from '@ember/object/computed';

export default Component.extend({

  subscription: null,
  account: null,

  usedUsers: reads('subscription.usedUsers'),

  usersUsage: reads('account.allowance.userUsage'),
  pendingUserLicenses: reads('account.allowance.pendingUserLicenses')

});
