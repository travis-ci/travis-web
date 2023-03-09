import Service, { inject as service } from '@ember/service';
import { alias, reads } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';

export default Service.extend({
  auth: service(),
  api: service(),
  storage: service(),
  currentUser: alias('auth.currentUser'),

  currentState: reads('fetch.lastSuccessful.value'),

  state: computed('currentState', function() {
    console.log("STATE!!");
    console.log(this.currentState.value);
    return parseInt(this.currentState.value);
  }),

  isEnabled: computed('currentState', function() {
    let val = parseInt(this.currentState.value);
    return val>=1 && val<=3;
  }),

  update: task(function* (val) {
    return yield this.api.patch('/storage/billing_wizard_state', { data: {value: val}, travisApiVersion: '3' });
  }).drop(),

  delete: task(function* (val) {
    return yield this.api.delete('/storage/billing_wizard_state', { travisApiVersion: '3' });
  }).drop(),

  fetch: task(function* () {
    return yield this.api.get('/storage/billing_wizard_state', { travisApiVersion: '3' });
  }).drop()
});
