import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import { computed } from '@ember/object';

export default Component.extend({
  auth: service(),
  storage: service(),
  wizard: service('wizard-state'),

  user: reads('auth.currentUser'),
  wizardState: reads('wizard.state'),
  wizardStep: null,

  isSyncDisabled: computed('wizardStep', function () {
    return this.wizardStep >= 1 && this.wizardStep <= 3;
  }),

  actions: {
    sync() {
      return this.user.sync(this.isOrganization);
    }
  }
});
