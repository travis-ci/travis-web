import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'span',
  classNames: ['insights-privacy-selector'],
  classNameBindings: ['isPrivateInsightsViewable:insights-privacy-selector--selectable'],

  isPrivateInsightsViewable: false,
  selectedOption: 0,

  availableOptions: computed('isPrivateInsightsViewable', function () {
    const options = ['public builds'];
    if (this.isPrivateInsightsViewable) {
      options.push('public and private builds');
    }
    return options;
  }),

  selectedOptionText: computed('selectedOption', 'availableOptions', function () {
    return this.availableOptions[this.selectedOption];
  })
});
