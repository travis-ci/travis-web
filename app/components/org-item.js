import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads, or } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  router: service(),

  tagName: 'li',
  classNames: ['media', 'account'],
  classNameBindings: ['type', 'selected'],

  account: null,

  selected: reads('account.selected'),
  name: or('account.name', 'account.login'),

  routeName: computed('account.isOrganization', function () {
    let isOrganization = this.get('account.isOrganization');
    return isOrganization ? 'organization' : 'account';
  }),

  routeModel: computed('account.isOrganization', function () {
    let isOrganization = this.get('account.isOrganization');
    if (isOrganization) return this.account.login;
  })
});
