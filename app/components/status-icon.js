import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  classNames: ['status-icon', 'icon'],
  classNameBindings: ['status'],
  attributeBindings: ['label:aria-label', 'label:title'],

  label: Ember.computed('status', function () {
    return `Job ${this.get('status')}`;
  }),

  hasPassed: Ember.computed('status', function () {
    return this.get('status') === 'passed' || this.get('status') === 'accepted';
  }),

  hasFailed: Ember.computed('status', function () {
    return this.get('status') === 'failed' || this.get('status') === 'rejected';
  }),

  hasErrored: Ember.computed('status', function () {
    return this.get('status') === 'errored';
  }),

  wasCanceled: Ember.computed('status', function () {
    return this.get('status') === 'canceled';
  }),

  isRunning: Ember.computed('status', function () {
    let status = this.get('status');
    let runningStates = ['started', 'queued', 'booting', 'received', 'created'];
    return runningStates.includes(status);
  }),

  isEmpty: Ember.computed('status', function () {
    if (!this.get('status')) {
      return true;
    } else {
      if (this.get('status') === '') {
        return true;
      } else {
        return false;
      }
    }
  })
});
