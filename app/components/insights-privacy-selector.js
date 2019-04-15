import Component from '@ember/component';
import { computed } from '@ember/object';

export const INSIGHTS_PRIVACY_OPTIONS = {
  PUBLIC: 'public builds',
  PRIVATE: 'public and private builds',
};

export default Component.extend({
  tagName: 'span',
  classNames: ['insights-privacy-selector'],
  classNameBindings: ['isPrivateViewable:insights-privacy-selector--selectable'],

  'data-test-insights-privacy-selector': '',

  isPrivateViewable: false,
  includePrivate: false,
  showFrame: false,

  availableOptions: computed('isPrivateViewable', function () {
    return this.isPrivateViewable ? Object.values(INSIGHTS_PRIVACY_OPTIONS) : [];
  }),

  currentState: computed('isPrivateViewable', 'includePrivate', function () {
    return (this.isPrivateViewable && this.includePrivate) ? INSIGHTS_PRIVACY_OPTIONS.PRIVATE : INSIGHTS_PRIVACY_OPTIONS.PUBLIC;
  }),

  setRequestPrivateInsights() {},

  actions: {
    selectInsightScope(option) {
      this.setRequestPrivateInsights(option === INSIGHTS_PRIVACY_OPTIONS.PRIVATE);
    }
  },
});
