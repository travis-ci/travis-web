import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';

export default Component.extend({
  flashes: service(),

  classNameBindings: ['type'],
  tagName: 'ul',

  messages: alias('flashes.messages'),

  type: computed('messages', function () {
    const classes = Array.from(new Set(this.messages.map(message => message.type))).join(' ');
    return `flash ${classes}`;
  }),

  actions: {
    closeMessage(msg) {
      return this.flashes.close(msg);
    }
  }
});
