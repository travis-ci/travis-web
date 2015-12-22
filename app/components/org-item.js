import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['media', 'account'],
  tagName: 'li',
  classNameBindings: ['type', 'selected'],
  typeBinding: 'account.type',
  selectedBinding: 'account.selected',
  tokenIsVisible: false,

  name: function() {
    return this.get('account.name') || this.get('account.login');
  }.property('account'),

  avatarUrl: function() {
    return this.get('account.avatarUrl') || false;
  }.property('account'),

  isUser: function() {
    return this.get('account.type') === 'user';
  }.property('account'),

  actions: {
    tokenVisibility() {
      return this.toggleProperty('tokenIsVisible');
    }
  }
});
