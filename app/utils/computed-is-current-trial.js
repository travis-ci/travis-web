import { computed } from '@ember/object';

export default function () {
  return computed('subscription.current_trial', function () {
    return this.subscription?.current_trial?.status === 'subscribed';
  });
}
