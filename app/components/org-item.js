import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';
import { service } from 'ember-decorators/service';

export default Component.extend({
  @service auth: null,
  @service router: null,

  classNames: ['media', 'account'],
  tagName: 'li',
  classNameBindings: ['type', 'selected'],

  tokenIsVisible: false,
  showCopySuccess: false,

  @alias('account.type') type: null,
  @alias('account.selected') selected: null,

  @computed('account.{name,login}')
  name(name, login) {
    return name || login;
  },

  @computed('account.avatarUrl')
  avatarUrl(url) {
    return url || false;
  },

  @computed('account.type')
  isUser(type) {
    return type === 'user';
  },

  // This keeps the org-item highlighted while a route is loading
  @computed('router.currentRouteName')
  linkRouteName(routeName) {
    if (routeName.endsWith('_loading')) {
      return 'account';
    } else {
      return routeName;
    }
  },

  actions: {
    tokenVisibility() {
      if (this.get('showCopySuccess')) {
        this.toggleProperty('showCopySuccess');
      }
      this.toggleProperty('tokenIsVisible');
    },

    copyTokenSuccessful() {
      if (!this.get('showCopySuccess')) {
        this.toggleProperty('showCopySuccess');
      }
    },
  },
});
