import Component from '@ember/component';
import { computed } from '@ember/object';
import { sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
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

function countBy(objs, name) {
  return objs.reduce((counts, obj) => {
    if (!counts[obj[name]]) {
      counts[obj[name]] = 0;
    }
    counts[obj[name]] += 1;
    return counts;
  }, {});
}

export default Component.extend({
  tagName: 'div',
  className: 'config-validate',
  classNameBindings: ['expanded'],

  yml: service(),

  expanded: false,
  initialConfig: true,
  messages: [],

  displayMessages: computed('messages.[]', 'expanded', function () {
    return this.get('messages.length') > 0 && this.expanded;
  }),

  sortedMessages: sort('messages', (lft, rgt) =>
    sortOrder(lft.level) - sortOrder(rgt.level)
  ),

  maxLevel: computed('sortedMessages.[]', function () {
    return this.get('sortedMessages.firstObject.level') || 'info';
  }),

  iconClass: computed('maxLevel', function () {
    return `icon icon-${this.get('maxLevel')}`;
  }),

  summary: computed('messages.[]', function () {
    if (this.get('messages.length') > 0) {
      return Object.entries(this.counts).map((entry) => formatLevel(...entry)).join(', ');
    }
  }),

  result: computed('messages', function () {
    let msgs = this.messages || [];
    let error = msgs.find(msg =>  msg.level == 'error' || msg.level == 'alert');
    return error ? error.level : 'valid';
  }),

  counts: computed('sortedMessages.[]', function () {
    return countBy(this.sortedMessages, 'level');
  }),

  toggle: function () {
    this.toggleProperty('expanded');
  },
});
