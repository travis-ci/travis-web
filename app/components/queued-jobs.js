import Component from '@ember/component';
import Ember from 'ember';
import config from 'travis/config/environment';
import Visibility from 'visibilityjs';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  updateTimesService: service('updateTimes'),

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
