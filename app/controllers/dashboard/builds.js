import Controller from '@ember/controller';
import Ember from 'ember';
import Visibility from 'visibilityjs';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';

export default Controller.extend({
  updateTimesService: service('updateTimes'),

  init() {
    this._super(...arguments);
    if (!Ember.testing) {
      Visibility.every(config.intervals.updateTimes, this.updateTimes.bind(this));
    }
  },

  updateTimes() {
    let updateTimesService = this.updateTimesService;

    updateTimesService.push(this.model);
  },
});
