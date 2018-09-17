import Controller from '@ember/controller';
import Ember from 'ember';
import Visibility from 'visibilityjs';
import { computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';
import config from 'travis/config/environment';

export default Controller.extend({
  @service('updateTimes') updateTimesService: null,

  page: 1,
  limit: 30,

  // FIXME this breaks when the initial load is for any page beyond the first

  @computed('page', 'limit')
  offset(page, limit) {
    return (page - 1) * limit;
  },

  @computed('offset', 'limit')
  offsetEnd(offset, limit) {
    return offset + limit;
  },

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
