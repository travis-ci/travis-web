import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { inject as service } from "@ember/service";

export default Component.extend({
  auth: service(),
  storage: service(),
  router: service(),
  features: service(),
  user: reads('auth.currentUser'),
  activeModel: null,
  model: reads('activeModel'),

  hasNoPlan: computed('model.allowance.subscriptionType', 'model.hasV2Subscription', 'model.subscription', function () {
    return !this.get('model.hasV2Subscription') && this.get('model.subscription') === undefined && this.get('model.allowance.subscriptionType') === 3;
  }),

  isUnconfirmed: computed('user.confirmedAt', function () {
    if (!this.user ||
        (this.storage.wizardStep > 0 && this.storage.wizardStep <= 1) ||
        this.router.currentRouteName == 'first_sync' ||
        this.router.currentRouteName == 'github_apps_installation')
      return false;
    return !this.user.confirmedAt;
  })
});
