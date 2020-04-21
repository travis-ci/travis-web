import Controller from '@ember/controller';
import Ember from 'ember';
import Polling from 'travis/mixins/polling';
import Visibility from 'visibilityjs';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';

export default Controller.extend(Polling, {
  updateTimesService: service('updateTimes'),

  updateTimes() {
    this.updateTimesService.push(this.get('build.stages'));
  },

  init() {
    this._super(...arguments);
    if (!Ember.testing) {
      return Visibility.every(config.intervals.updateTimes, this.updateTimes.bind(this));
    }
  },
});
