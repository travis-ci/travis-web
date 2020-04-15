import Service, { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { equal, reads } from '@ember/object/computed';

export default Service.extend({
  api: service(),
  store: service(),

  request: null,
  repo: reads('request.repo'),
  model: reads('request.build'),
  number: reads('model.number'),
  state: reads('request.state'),
  submitting: reads('submit.isRunning'),
  pending: equal('state', 'pending'),
  success: equal('state', 'finished'),
  rejected: equal('state', 'rejected'),

  submit: task(function* (data) {
    try {
      this.set('request', this.store.createRecord('request', data));
      yield this.request.save();
      yield this.poll.perform();
    } catch (e) {
      console.log(e);
      // return this.displayError(e);
    }
  }).drop(),

  poll: task(function* () {
    let count = 0;
    while (!this.success && !this.rejected && count++ < 30) {
      yield timeout(1000);
      yield this.request.reload();
      console.log(this.request.state);
    }
    // if not finished display a message that the request has not been processed after 30s,
    // and offer going to the requests page (?)
  }).drop(),

  reset() {
    this.set('request', null);
  }
});
