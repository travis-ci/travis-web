import Ember from 'ember';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';

export default Ember.Component.extend({
  classNames: ['media', 'account'],
  tagName: 'li',
  classNameBindings: ['type', 'selected'],

  tokenIsVisible: false,

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

  actions: {
    tokenVisibility() {
      this.toggleProperty('tokenIsVisible');
    }
  },
});
