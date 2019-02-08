import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'span',
  classNames: ['insights-privacy-selector'],
  classNameBindings: ['isPrivateInsightsViewable:insights-privacy-selector--selectable'],

  isPrivateInsightsViewable: false,
  includePrivate: false,

  availableOptions: computed('isPrivateInsightsViewable', function () {
    const options = [];
    if (this.isPrivateInsightsViewable) {
      if (this.includePrivate) {
        options.push('public builds');
      } else {
        options.push('public and private builds');
      }
    }
    return options;
  }),

  currentState: computed('isPrivateInsightsViewable', 'includePrivate', function () {
    return (this.isPrivateInsightsViewable && this.includePrivate) ?
      'public and private builds' :
      'public builds';
  }),

  actions: {
    handleSubmit() {
      // console.log('submit');
    }
  },
});
