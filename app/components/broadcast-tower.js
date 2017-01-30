import Ember from 'ember';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  classNames: ['broadcast'],
  isOpen: false,
  timeoutId: '',

  toggle: task(function* () {
    this.toggleProperty('isOpen');
    this.sendAction('toggleBroadcasts');

    // Acceptance tests will wait for the promise to resolve, so skip in tests
    if (this.get('isOpen') && !Ember.testing) {
      yield new Ember.RSVP.Promise(resolve => Ember.run.later(resolve, 10000));

      this.toggleProperty('isOpen');
      this.sendAction('toggleBroadcasts');
    }
  }).restartable()
});
