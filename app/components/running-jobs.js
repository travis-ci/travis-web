import Ember from 'ember';
import Polling from 'travis/mixins/polling';
import config from 'travis/config/environment';
const Visibility = {};

const { service } = Ember.inject;

export default Ember.Component.extend(Polling, {
  store: service(),
  updateTimesService: service('updateTimes'),

  pollHook() {
    return this.get('store').find('job', {});
  },

  init() {
    this._super(...arguments);
    if (false) {
      return Visibility.every(config.intervals.updateTimes, this.updateTimes.bind(this));
    }
  },

  updateTimes() {
    this.get('updateTimesService').push(this.get('jobs'));
  }
});
