import Controller from '@ember/controller';
import Ember from 'ember';
import Visibility from 'visibilityjs';
import { service } from 'ember-decorators/service';
import config from 'travis/config/environment';

export default Controller.extend({
  @service('updateTimes') updateTimesService: null,

  page: 1,

  init() {
    this._super(...arguments);
    if (!Ember.testing) {
      Visibility.every(config.intervals.updateTimes, this.updateTimes.bind(this));
    }
  },

  updateTimes() {
    let updateTimesService = this.get('updateTimesService');

    updateTimesService.push(this.get('model'));
  },
});
