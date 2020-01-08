import Component from '@ember/component';
import Ember from 'ember';
import { reads } from '@ember/object/computed';
import config from 'travis/config/environment';
import Visibility from 'travis-visibilityjs';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  updateTimesService: service('updateTimes'),

  queuedJobs: reads('jobs'),

  init() {
    this._super(...arguments);
    if (!Ember.testing) {
      return Visibility.every(config.intervals.updateTimes, this.updateTimes.bind(this));
    }
  },

  updateTimes() {
    this.updateTimesService.push(this.jobs);
  }
});
