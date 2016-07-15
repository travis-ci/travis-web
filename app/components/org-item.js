import Ember from 'ember';

const { alias } = Ember.computed;

export default Ember.Component.extend({
  classNames: ['media', 'account'],
  tagName: 'li',
  classNameBindings: ['type', 'selected'],
  type: alias('account.type'),
  selected: alias('account.selected'),
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
