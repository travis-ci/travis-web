import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { reads, not, or } from '@ember/object/computed';

export default Controller.extend({
  auth: service(),
  externalLinks: service(),
  features: service(),

  user: reads('auth.currentUser'),
  account: reads('model'),
  subscription: reads('account.subscription'),

  isSubscribed: or('subscription.isSubscribed', 'account.education'),
  isNotSubscribed: not('isSubscribed'),

  actions: {
    sync() {
      return this.user.sync();
    },

    toggle(hook) {
      return hook.toggle();
    }
  }
});
