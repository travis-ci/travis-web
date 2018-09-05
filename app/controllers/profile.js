import Controller from '@ember/controller';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';

/**
 * This pseudo-routing is necessary because 'account.settings.unsubscribe' route
 * needs to be nested under 'profile' but it has different layout,
 * which has to be overwritten here
 */
export default Controller.extend({
  @service router: null,

  @computed('router.currentRouteName')
  showProfile(currentRouteName) {
    return currentRouteName !== 'account.settings.unsubscribe';
  },

  @computed('router.currentRouteName')
  showLoading(currentRouteName) {
    return ['account_loading', 'profile_loading'].includes(currentRouteName);
  }
});
