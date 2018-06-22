import Component from '@ember/component';
import { computed } from 'ember-decorators/object';

export default Component.extend({
  @computed('account.subscriptionPermissions.create')
  havePermissions(createPermissions) {
    return createPermissions;
  },

  @computed('subscription')
  isNew(subscription) {
    return !subscription;
  }
});
