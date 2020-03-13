import Component from '@ember/component';
import { computed } from '@ember/object';
import { and, not, reads, sort } from '@ember/object/computed';
import { pluralize } from 'ember-inflector';
import WithConfigValidation from 'travis/mixins/components/with-config-validation';

const MSGS = {
  'alert': 'alert',
  'error': 'error',
  'warn': 'warning',
  'info': 'info',
};

export default Component.extend(WithConfigValidation, {
  tagName: 'div',
  className: 'request-messages',
  expanded: false,
  collapsed: not('expanded'),
  displaySummary: and('collapsed', 'summary'),

  messgages: computed(() => []),
  request: null,
  repo: reads('request.repo'),

  toggleStatus: computed('expanded', function () {
    return this.get('expanded') ? 'expanded' : 'collapsed';
  }),

  sortedMessages: sort('messages', (lft, rgt) =>
    sortOrder(lft.level) - sortOrder(rgt.level)
  ),

  maxLevel: computed('sortedMessages', function () {
    return this.get('sortedMessages.firstObject.level') || 'info';
  }),

  iconClass: computed('maxLevel', function () {
    return `icon icon-${this.get('maxLevel')}`;
  }),

  summary: computed('sortedMessages', function () {
    let counts = countBy(this.get('sortedMessages'), 'level');
    if (Object.entries(counts).length > 0) {
      return Object.entries(counts).map((entry) => formatLevel(...entry)).join(', ');
    }
  }),

  actions: {
    toggle() {
      this.toggleProperty('expanded');
    }
  }
});

function formatLevel(level, count) {
  return pluralize(count, MSGS[level]);
}

function sortOrder(level) {
  return Object.keys(MSGS).indexOf(level);
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

