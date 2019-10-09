import Component from '@ember/component';
import { computed } from '@ember/object';
import { filter, notEmpty } from '@ember/object/computed';
import { pluralize } from 'ember-inflector';

const READABLE_LEVELS = {
  'alert': 'alert',
  'error': 'error',
  'warn': 'warning',
};

export default Component.extend({
  tagName: '',
  toggleStatus: null,

  isExpanded: notEmpty('nonInfoMessages'),

  toggleStatusClass: computed('isExpanded', function () {
    return this.get('isExpanded') ? 'expanded' : 'collapsed';
  }),

  nonInfoMessages: filter('request.messages', (message) =>
    message.level !== 'info'
  ),

  maxLevel: computed('nonInfoMessages.[].level', function () {
    return this.nonInfoMessages.sortBy('level')[0].level;
  }),

  iconClass: computed('maxLevel', function () {
    return `icon icon-${this.get('maxLevel')}`;
  }),

  summary: computed('nonInfoMessages', function () {
    let counts = countBy(this.get('nonInfoMessages'), 'level');
    if (Object.entries(counts).length > 0) {
      return Object.entries(counts).map((entry) => formatLevel(...entry)).join(', ');
    }
  }),

  actions: {
    toggle() {
      this.toggleProperty('isExpanded');
    }
  }
});

function formatLevel(level, count) {
  return pluralize(count, READABLE_LEVELS[level]);
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
