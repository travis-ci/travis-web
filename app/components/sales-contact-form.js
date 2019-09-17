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

  utmSource: 'travis-web',

  send: task(function* () {
    const { name, email, teamSize, phone, message, utmSource } = this;
    const data = {
      name,
      email,
      team_size: teamSize,
      phone,
      message,
      utm_source: utmSource,
    };

    try {
      const lead = this.store.createRecord('lead', data);

      yield lead.save();
      lead.unloadRecord();
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
    this.setProperties({
      name: '',
      email: '',
      teamSize: '',
      phone: '',
      message: '',
    });
  },

  init() {
    this.reset();
    this._super(...arguments);
  },

  didInsertElement() {
    this.flashes.clear();
    return this._super(...arguments);
  },

  willDestroyElement() {
    this.flashes.clear();
    return this._super(...arguments);
  },

  actions: {
    submit() {
      this.send.perform();
    }
  }
});
