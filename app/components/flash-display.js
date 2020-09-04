import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';

export default Component.extend({
  flashes: service(),

  classNameBindings: ['className'],
  tagName: 'ul',

  messages: alias('flashes.messages'),

  className: computed('messages.@each.className', function () {
    const classes = this.messages.uniqBy('className').mapBy('className').join(' ');
    return `flash ${classes}`;
  }),

  actions: {
    closeMessage(msg) {
      return this.flashes.close(msg);
    }
  }
});
