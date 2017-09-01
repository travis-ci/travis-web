import Ember from 'ember';
import Polling from 'travis/mixins/polling';
import config from 'travis/config/environment';
import Visibility from 'npm:visibilityjs';
import { service } from 'ember-decorators/service';

export default Ember.Component.extend(Polling, {
  @service store: null,
  @service('updateTimes') updateTimesService: null,

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
