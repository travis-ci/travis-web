import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  classNames: ['status-icon', 'icon'],
  classNameBindings: ['status'],
  attributeBindings: ['label:aria-label', 'label:title'],

  label: function() {
    return 'Job ' + this.get('status');
  }.property('status'),

  hasPassed: function() {
    return this.get('status') === 'passed' || this.get('status') === 'accepted';
  }.property('status'),

  hasFailed: function() {
    return this.get('status') === 'failed' || this.get('status') === 'rejected';
  }.property('status'),

  hasErrored: function() {
    return this.get('status') === 'errored';
  }.property('status'),

  wasCanceled: function() {
    return this.get('status') === 'canceled';
  }.property('status'),

  isRunning: function() {
    return this.get('status') === 'started' || this.get('status') === 'queued' || this.get('status') === 'booting' || this.get('status') === 'received' || this.get('status') === 'created';
  }.property('status'),

  isEmpty: function() {
    if (!this.get('status')) {
      return true;
    } else {
      if (this.get('status') === '') {
        return true;
      } else {
        return false;
      }
    }
  }.property('status')
});
