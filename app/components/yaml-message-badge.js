import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import { alias, filter } from 'ember-decorators/object/computed';

export default Component.extend({
  tagName: '',

  @filter('messages')
  filteredMessages(message) {
    return message.level !== 'info';
  },

  @alias('filteredMessages.length') count: null,

  @computed('filteredMessages.@each.level')
  levelClass(messages) {
    if (messages.any(message => message.level === 'error')) {
      return 'error';
    } else {
      return 'warn';
    }
  }
});
