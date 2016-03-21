import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  classNames: ['request-icon', 'icon'],
  classNameBindings: ['event', 'state'],

  isPush: function() {
    return this.get('event') === 'push';
  }.property('event'),

  isPR: function() {
    return this.get('event') === 'pull_request';
  }.property('event'),

  isCron: function() {
    return this.get('event') === 'cron';
  }.property('event'),

  isAPI: function() {
    return this.get('event') === 'api';
  }.property('event'),

  isEmpty: function() {
    if (this.get('event') === null || this.get('event') === null) {
      return true;
    }
  }.property('event')
});
