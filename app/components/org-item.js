import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import { reads, or } from '@ember/object/computed';
import { service } from 'ember-decorators/service';

export default Component.extend({
  @service router: null,

  tagName: 'li',
  classNames: ['media', 'account'],
  classNameBindings: ['type', 'selected'],

  account: null,

  selected: reads('account.selected'),
  name: or('account.name', 'account.login'),

  @computed('account.isOrganization')
  routeName(isOrganization) {
    return isOrganization ? 'organization' : 'account';
  },

  @computed('account.isOrganization')
  routeModel(isOrganization) {
    if (isOrganization) return this.account.login;
  }
});
