import Controller from '@ember/controller';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';

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
