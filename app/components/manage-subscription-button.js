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

  @computed('subscription.status')
  label(status) {
    if (status === 'subscribed') {
      return 'Edit subscription';
    } else {
      return 'Resubscribe';
    }
  },

  @computed('subscription.status')
  tooltip(status) {
    if (status === 'subscribed') {
      return 'You do not have permission to edit this subscription';
    } else {
      return 'You do not have permission to resubscribe';
    }
  },
});
