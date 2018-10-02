import Component from '@ember/component';
import { alias, filter } from 'ember-decorators/object/computed';

export default Component.extend({
  tagName: '',

  @filter('messages')
  filteredMessages(message) {
    return message.level !== 'info';
  },

  @alias('filteredMessages.length') count: null,
});
