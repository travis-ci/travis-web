import Component from '@ember/component';
import { computed } from '@ember/object';
import { sort, gt, and, reads } from '@ember/object/computed';
import countBy from 'travis/utils/count-by';
import { pluralize } from 'ember-inflector';

// a lot of this is duplicated from request-messages-list
const MESSAGES = {
  alert: 'alert',
  error: 'error',
  warn: 'warning',
  info: 'info',
};

function formatLevel(level, count) {
  return pluralize(count, MESSAGES[level]);
}

function sortOrder(level) {
  return Object.keys(MESSAGES).indexOf(level);
}

export default Component.extend({
  tagName: 'div',
  className: 'config-validate',
  classNameBindings: ['expanded'],

  expanded: false,
  initialConfig: true,
  messages: [],

  hasMessages: gt('messages.length', 0),
  displayMessages: and('hasMessages', 'expanded'),

  sortedMessages: sort('messages', (lft, rgt) =>
    sortOrder(lft.level) - sortOrder(rgt.level)
  ),

  firstMessage: reads('sortedMessages.firstObject'),
  firstMessageLevel: reads('firstMessage.level'),
  maxLevel: computed('firstMessageLevel', function () {
    return this.firstMessageLevel ? this.firstMessageLevel : 'info';
  }),

  iconClass: computed('maxLevel', function () {
    return `icon icon-${this.maxLevel}`;
  }),

  counts: computed('sortedMessages.[]', function () {
    return countBy(this.sortedMessages, 'level');
  }),

  summary: computed('hasMessages', 'counts.level', function () {
    if (this.hasMessages) {
      return Object.entries(this.counts).map((entry) => formatLevel(...entry)).join(', ');
    }
  }),

  result: computed('messages.[]', function () {
    let msgs = this.messages || [];
    let error = msgs.find(msg =>  msg.level === 'error' || msg.level === 'alert');
    return error ? error.level : 'valid';
  }),

  toggle: function () {
    this.toggleProperty('expanded');
  },
});
