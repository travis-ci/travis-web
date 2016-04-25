import Ember from 'ember';
import Polling from 'travis/mixins/polling';
import config from 'travis/config/environment';

const { service } = Ember.inject;

export default Ember.Component.extend(Polling, {
  store: service(),
  updateTimesService: service('updateTimes'),

  pollHook(store) {
    return this.get('store').find('job', {});
  },

  init() {
    this._super(...arguments);
    if (!Ember.testing) {
      return Visibility.every(config.intervals.updateTimes, this.updateTimes.bind(this));
    }
  },

  updateTimes() {
    this.get('updateTimesService').push(this.get('jobs'));
  }
});
