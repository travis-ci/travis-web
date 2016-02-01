import Ember from 'ember';
import Polling from 'travis/mixins/polling';
import config from 'travis/config/environment';

export default Ember.Component.extend(Polling, {
  store: Ember.inject.service(),
  updateTimesService: Ember.inject.service('updateTimes'),

  pollHook(store) {
    return this.get('store').find('job', {});
  },

  init() {
    this._super.apply(this, arguments);
    if (!Ember.testing) {
      return Visibility.every(config.intervals.updateTimes, this.updateTimes.bind(this));
    }
  },

  updateTimes() {
    this.get('updateTimesService').push(this.get('jobs'));
  }
});
