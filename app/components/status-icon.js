import Component from '@ember/component';
import { computed } from '@ember/object';
import { equal, empty } from '@ember/object/computed';

export default Component.extend({
  tagName: 'span',
  classNames: ['status-icon', 'icon'],
  classNameBindings: ['status'],
  attributeBindings: ['label:aria-label', 'label:title'],

  label: computed('status', function () {
    return `Job ${this.status}`;
  }),

  hasPassed: computed('status', function () {
    return ['passed', 'approved'].includes(this.status);
  }),

  hasFailed: computed('status', function () {
    return ['failed', 'rejected'].includes(this.status);
  }),

  hasErrored: equal('status', 'errored'),
  wasCanceled: equal('status', 'canceled'),

  isRunning: computed('status', function () {
    let runningStates = ['started', 'queued', 'booting', 'received', 'created', 'pending'];
    return runningStates.includes(this.status);
  }),

  isEmpty: empty('status')
});
