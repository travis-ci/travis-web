import Ember from 'ember';
import config from 'travis/config/environment';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  updateTimesService: Ember.inject.service('updateTimes'),

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
