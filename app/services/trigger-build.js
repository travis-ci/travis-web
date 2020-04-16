import Service, { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { equal, reads, or } from '@ember/object/computed';

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
  finished: or('success', 'rejected', 'error'),
  timedout: false,

  submit: task(function* (data) {
    try {
      this.set('request', this.store.createRecord('request', data));
      yield this.request.save();
      yield this.poll.perform();
    } catch (e) {
      this.set('error', e.message);
    }
  }).drop(),

  poll: task(function* () {
    let count = 0;
    while (false && !this.finished && count++ < 45) {
      yield timeout(1000 + (count ** 2) * 5);
      yield this.request.reload();
    }

    if (!this.finished) {
      this.set('error', 'timeout');
    }
  }).drop(),

  reset() {
    this.set('request', null);
    this.set('error', null);
  }
});
