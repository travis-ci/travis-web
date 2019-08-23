import Component from '@ember/component';
import { reads } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  tagName: '',

  name: '',
  email: '',
  size: '',
  phone: '',
  help: '',

  requiredMark: 'Required',

  isSubmitting: reads('send.isRunning'),

  send: task(function* () {
    const { name } = this;
    return yield name;
  }),

  actions: {
    submit() {
      return false;
    }
  }
});
