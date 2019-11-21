import Component from '@ember/component';
import Ember from 'ember';
import { computed } from '@ember/object';
import config from 'travis/config/environment';
import Visibility from 'visibilityjs';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  updateTimesService: service('updateTimes'),

  queuedJobs: computed('jobs.@each.state', function () {
    const queuedStates = ['created', 'queued'];
    return this.jobs.filter(job => queuedStates.includes(job.state));
  }),

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
