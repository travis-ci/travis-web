import Ember from 'ember';
import config from 'travis/config/environment';
import Visibility from 'npm:visibilityjs';
import { service } from 'ember-decorators/service';

export default Ember.Component.extend({
  @service store: null,
  @service('updateTimes') updateTimesService: null,

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
