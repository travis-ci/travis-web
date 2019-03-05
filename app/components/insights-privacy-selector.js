import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'span',
  classNames: ['insights-privacy-selector'],
  classNameBindings: ['isPrivateViewable:insights-privacy-selector--selectable'],

  isPrivateViewable: false,
  includePrivate: false,

  availableOptions: computed('isPrivateViewable', 'includePrivate', function () {
    const options = [];
    if (this.isPrivateViewable) {
      if (this.includePrivate) {
        options.push('public builds');
      } else {
        options.push('public and private builds');
      }
    }
    return options;
  }),

  currentState: computed('isPrivateViewable', 'includePrivate', function () {
    return (this.isPrivateViewable && this.includePrivate) ?
      'public and private builds' :
      'public builds';
  }),

  actions: {
    selectInsightScope(option) {
      this.sendAction('setRequestPrivateInsights', (option === 'public and private builds'));
    }
  },
});
