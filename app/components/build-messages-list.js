import { A } from '@ember/array';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { not } from '@ember/object/computed';

export default Component.extend({
  tagName: '',
  toggleStatus: undefined,
  readableLevels: {
    'alert': 'alert',
    'error': 'error',
    'warn': 'warning',
  },

  nonInfoMessages: computed('request.messages', function () {
    return A(this.get('request.messages')).rejectBy('level', 'info');
  }),

  maxLevel: computed('job.build.request', function () {
    let msgs = this.get('nonInfoMessages');
    if (msgs.length > 0) {
      return msgs.sortBy('level')[0].level;
    }
  }),

  iconClass: computed('maxLevel', function () {
    let level = this.get('maxLevel');
    return `icon icon-${level}`;
  }),

  summary: computed('nonInfoMessages', function () {
    let counts = this.countBy(this.get('nonInfoMessages'), 'level');
    if (Object.entries(counts).length > 0) {
      let summary = Object.entries(counts).map((entry) => this.formatLevel(...entry)).join(', ');
      return `(${summary})`;
    }
  }),

  formatLevel: function (level, count) {
    return [count, this.readableLevel(level, count)].join(' ');
  },

  readableLevel: function (level, count) {
    level = this.get('readableLevels')[level];
    if (count > 1) {
      level = `${level}s`;
    }
    return level;
  },

  isExpanded: computed('nonInfoMessages', 'toggleStatus', function () {
    if (this.get('toggleStatus') != undefined) {
      return this.get('toggleStatus');
    }
    return this.get('nonInfoMessages').length > 0;
  }),

  isCollapsed: not('isExpanded'),

  toggleStatusClass: computed('isExpanded', function () {
    return this.get('isExpanded') ? 'expanded' : 'collapsed';
  }),

  toggle: function () {
    this.set('toggleStatus', !this.get('isExpanded'));
  },

  actions: {
    toggle: function () {
      this.toggle();
    }
  },

  countBy: function (objs, name) {
    return objs.reduce((counts, obj) => {
      if (!counts[obj[name]]) {
        counts[obj[name]] = 0;
      }
      counts[obj[name]] += 1;
      return counts;
    }, {});
  }
});
