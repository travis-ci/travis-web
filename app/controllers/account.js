import Controller from '@ember/controller';
import { service } from 'ember-decorators/service';
import { action } from 'ember-decorators/object';
import { reads, not, or } from '@ember/object/computed';

export default Controller.extend({
  @service auth: null,
  @service externalLinks: null,
  @service features: null,

  user: reads('auth.currentUser'),
  account: reads('model'),
  subscription: reads('account.subscription'),

  isSubscribed: or('subscription.isSubscribed', 'account.education'),
  isNotSubscribed: not('isSubscribed'),

  @action
  sync() {
    return this.user.sync();
  },

  @action
  toggle(hook) {
    return hook.toggle();
  }
});
