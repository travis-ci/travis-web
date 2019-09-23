import Component from '@ember/component';
import { reads, and } from '@ember/object/computed';

export default Component.extend({
  hasSubscriptionPermissions: reads('account.hasSubscriptionPermissions'),
  canResubscribe: and('subscription.isResubscribable', 'hasSubscriptionPermissions'),
});
