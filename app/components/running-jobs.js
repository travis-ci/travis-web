import Component from '@ember/component';
import Polling from 'travis/mixins/polling';
import { service } from 'ember-decorators/service';

export default Component.extend(Polling, {
  @service store: null,
  @service('updateTimes') updateTimesService: null,

  pollHook() {
    return this.get('store').find('job', {});
  },

  init() {
    this._super(...arguments);
  },

  updateTimes() {
    this.get('updateTimesService').push(this.get('jobs'));
  }
});
