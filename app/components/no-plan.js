import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  model: null,

  accountRoute: computed('model', function () {
    return this.model === null || !this.model.vcsType.includes('Organization') ? 'account.billing' : 'organization.billing';
  }),
});
