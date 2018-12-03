import Component from '@ember/component';
import Ember from 'ember';
import Polling from 'travis/mixins/polling';
import config from 'travis/config/environment';
import Visibility from 'visibilityjs';
import { inject as service } from '@ember/service';

export default Component.extend(Polling, {
  store: service(),
  updateTimesService: service('updateTimes'),

  pollHook() {
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
