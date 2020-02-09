import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { sort } from '@ember/object/computed';
import { debounce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { pluralize } from 'ember-inflector';

// a lot of this is duplicated from request-messages-list
const MSGS = {
  'alert': 'alert',
  'error': 'error',
  'warn': 'warning',
  'info': 'info',
};

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

export default Component.extend({
  tagName: 'div',
  className: 'config-validate',
  classNameBindings: ['expanded'],

  yml: service(),

  expanded: false,
  initialConfig: true,

  configsChanged: observer('configs', function () {
    if (this.configs[0] && this.configs[0].source == 'api') {
      debounce(this, this.validate, 1000);
    } else {
      this.reset();
    }
  }),

  validate: function (final) {
    if (this.validating) return;
    this.set('validating', true);
    this.yml.validate(this.configs).
      then(this.success.bind(this), this.error.bind(this)).
      finally(() => this.set('validating', false));
  },

  success: function (data) {
    let error = data.messages.find(msg =>  msg.level == 'error' || msg.level == 'alert');
    let result = error ? error.level : 'valid';
    this.setResult(result, data.config, data.messages);
    this.set('level', this.maxLevel);
  },

  error: function () {
    this.setResult('Invalid format');
    this.set('level', 'error');
  },

  reset: function () {
    this.setResult();
    this.set('level', undefined);
  },

  setResult: function (result, config, messages) {
    this.set('result', result);
    this.set('merged', config);
    this.set('messages', messages);
  },

  displayMessages: computed('messages', 'expanded', function () {
    return this.messages && this.messages.length > 0 && this.expanded;
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

  summary: computed('counts', function () {
    if (Object.entries(this.counts).length > 0) {
      return Object.entries(this.counts).map((entry) => formatLevel(...entry)).join(', ');
    }
  }),

  counts: computed('sortedMessages', function () {
    return countBy(this.get('sortedMessages'), 'level');
  }),

  toggle: function () {
    this.toggleProperty('expanded');
  },
});
