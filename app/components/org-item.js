import Ember from 'ember';

const { alias } = Ember.computed;

export default Ember.Component.extend({
  classNames: ['media', 'account'],
  tagName: 'li',
  classNameBindings: ['type', 'selected'],
  type: alias('account.type'),
  selected: alias('account.selected'),
  tokenIsVisible: false,

  name: Ember.computed('account', function () {
    return this.get('account.name') || this.get('account.login');
  }),

  avatarUrl: Ember.computed('account', function () {
    return this.get('account.avatarUrl') || false;
  }),

  isUser: Ember.computed('account', function () {
    return this.get('account.type') === 'user';
  }),

  actions: {
    tokenVisibility() {
      this.toggleProperty('tokenIsVisible');
    }
  }
});
