import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'span',
  classNames: ['insights-privacy-selector'],
  classNameBindings: ['isPrivateViewable:insights-privacy-selector--selectable'],

  isPrivateViewable: false,
  includePrivate: false,
  showFrame: false,

  availableOptions: computed('isPrivateViewable', 'includePrivate', function () {
    const options = [];
    if (this.isPrivateViewable) {
      options.push('public builds');
      options.push('public and private builds');
    }
    return options;
  }),

  currentState: computed('isPrivateViewable', 'includePrivate', function () {
    return (this.isPrivateViewable && this.includePrivate) ?
      'public and private builds' :
      'public builds';
  }),
  setRequestPrivateInsights: () => {},

  actions: {
    selectInsightScope(option) {
      this.setRequestPrivateInsights(option === 'public and private builds');
    }
  },
});
