import Component from '@ember/component';
import Ember from 'ember';
import { computed } from '@ember/object';
import Polling from 'travis/mixins/polling';
import config from 'travis/config/environment';
import Visibility from 'visibilityjs';
import { inject as service } from '@ember/service';

export default Component.extend(Polling, {
  store: service(),
  updateTimesService: service('updateTimes'),

  pollHook() {
    return this.store.find('job', {});
  },

  runningJobs: computed('jobs.@each.state', function () {
    const runningStates = ['started', 'received', 'failed', 'canceled'];
    return this.jobs.filter(job => runningStates.includes(job.state));
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
