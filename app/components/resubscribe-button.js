import Component from '@ember/component';
import { computed } from 'ember-decorators/object';

export default Component.extend({
  @computed('subscription', 'subscription.permissions.write',
    'account.subscriptionPermissions.create')
  havePermissions(subscription, writePermissions, createPermissions) {
    if (subscription) {
      return writePermissions;
    } else {
      return createPermissions;
    }
  },
});
