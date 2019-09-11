import Component from '@ember/component';
import { bool, reads } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: '',

  api: service(),
  flashes: service(),
  raven: service(),

  name: '',
  email: '',
  size: '',
  phone: '',
  message: '',

  requiredMark: 'Required',

  isSubmitting: reads('send.isRunning'),
  isSuccess: bool('send.lastSuccessful.value'),

  send: task(function* () {
    const { api, name, email, size, phone, message } = this;
    const data = {
      name,
      email,
      team_size: size,
      phone,
      message,
      utm_source: 'web-plans-page',
    };

    try {
      const result = yield api.post('/lead', { data });

      this.setProperties({
        name: '',
        email: '',
        size: '',
        phone: '',
        message: '',
      });

      return result;
    } catch (error) {
      this.flashes.error(
        "Something went wrong while submitting your request. We're working to fix it!"
      );
      this.raven.logException('Lead/Close request: API request error');
      throw error;
    }
  }).drop(),

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
      return false;
    }
  }
});
