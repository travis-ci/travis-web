import Component from '@ember/component';
import { service } from 'ember-decorators/service';

export default Component.extend({
  @service store: null,
  @service('updateTimes') updateTimesService: null,

  init() {
    this._super(...arguments);
  },

  updateTimes() {
    this.get('updateTimesService').push(this.get('jobs'));
  }
});
