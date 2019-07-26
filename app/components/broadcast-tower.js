import { later } from '@ember/runloop';
import { Promise as EmberPromise } from 'rsvp';
import Component from '@ember/component';
import Ember from 'ember';
import { task } from 'ember-concurrency';

export default Component.extend({
  classNames: ['broadcast'],
  isOpen: false,
  timeoutId: '',

  toggleBroadcasts() {},

  toggle: task(function* () {
    this.toggleProperty('isOpen');
    this.toggleBroadcasts();

    // Acceptance tests will wait for the promise to resolve, so skip in tests
    if (this.isOpen && !Ember.testing) {
      yield new EmberPromise(resolve => later(resolve, 10000));

      this.toggleProperty('isOpen');
      this.toggleBroadcasts();
    }
  }).restartable()
});
