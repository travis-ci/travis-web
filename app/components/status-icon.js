import Ember from 'ember';
import { computed } from 'ember-decorators/object';
import { equal, empty } from 'ember-decorators/object/computed';

export default Ember.Component.extend({
  tagName: 'span',
  classNames: ['status-icon', 'icon'],
  classNameBindings: ['status'],
  attributeBindings: ['label:aria-label', 'label:title'],

  @computed('status')
  label(status) {
    return `Job ${status}`;
  },

  @computed('status')
  hasPassed(status) {
    return ['passed', 'accepted'].includes(status);
  },

  @computed('status')
  hasFailed(status) {
    return ['failed', 'rejected'].includes(status);
  },

  @equal('status', 'errored') hasErrored: null,

  @equal('status', 'canceled') wasCanceled: null,

  @computed('status')
  isRunning(status) {
    let runningStates = ['started', 'queued', 'booting', 'received', 'created'];
    return runningStates.includes(status);
  },

  @empty('status') isEmpty: null,
});
