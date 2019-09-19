import Component from '@ember/component';
import { bool, reads } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: '',

  flashes: service(),
  raven: service(),
  store: service(),

  requiredMark: 'Required',

  isSubmitting: reads('send.isRunning'),
  isSuccess: bool('send.lastSuccessful.value'),

  lead: null,
  utmSource: 'travis-web',

  send: task(function* () {
    try {
      yield this.lead.save();
      this.reset();
      return true;
    } catch (error) {
      this.flashes.error(
        "Something went wrong while submitting your request. We're working to fix it!"
      );
      this.raven.logException('Lead/Close request: API request error');
      throw error;
    }
  }).drop(),

  reset() {
    if (this.lead) this.lead.unloadRecord();
    this.set('lead', this.store.createRecord('lead', { utm_source: this.utmSource }));
  },

  didInsertElement() {
    this.reset();
    this.flashes.clear();
    return this._super(...arguments);
  },

  willDestroyElement() {
    this.flashes.clear();
    return this._super(...arguments);
  }
});
