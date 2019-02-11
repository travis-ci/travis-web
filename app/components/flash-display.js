import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';

export default Component.extend({
  flashes: service(),

  classNames: ['flash'],
  tagName: 'ul',

  messages: alias('flashes.messages'),

  actions: {
    closeMessage(msg) {
      return this.get('flashes').close(msg);
    }
  }
});
