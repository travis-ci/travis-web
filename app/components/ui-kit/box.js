import Component from '@ember/component';
import { computed } from '@ember/object';
import { none } from '@ember/object/computed';
import { checkDictionary } from 'travis/utils/ui-kit/assertions';

const DISPLAYS = {
  BLOCK: 'block',
  INLINE_BLOCK: 'inline-block',
  FLEX: 'flex',
};

export default Component.extend({

  // Public interface
  tag: 'div',
  display: null,
  margin: null,

  // Private
  hasNoMarginTop: none('margin.top'),
  marginTop: computed('hasNoMarginTop', 'margin.top', function () {
    if (this.hasNoMarginTop) {
      return '';
    }

    const { top } = this.margin;
    const isNegative = typeof top === 'number' && top < 0;
    return `${isNegative ? '-' : ''}mt-${top}`;
  }),
  hasNoMarginRight: none('margin.right'),
  marginRight: computed('hasNoMarginRight', 'margin.right', function () {
    if (this.hasNoMarginRight) {
      return '';
    }

    const { right } = this.margin;
    const isNegative = typeof right === 'number' && right < 0;
    return `${isNegative ? '-' : ''}mr-${right}`;
  }),
  hasNoMarginBottom: none('margin.bottom'),
  marginBottom: computed('hasNoMarginBottom', 'margin.bottom', function () {
    if (this.hasNoMarginBottom) {
      return '';
    }

    const { bottom } = this.margin;
    const isNegative = typeof bottom === 'number' && bottom < 0;
    return `${isNegative ? '-' : ''}mb-${bottom}`;
  }),
  hasNoMarginLeft: none('margin.left'),
  marginLeft: computed('hasNoMarginLeft', 'margin.left', function () {
    if (this.hasNoMarginLeft) {
      return '';
    }

    const { left } = this.margin;
    const isNegative = typeof left === 'number' && left < 0;
    return `${isNegative ? '-' : ''}ml-${left}`;
  }),

  // Lifecycle
  init() {
    this._super(...arguments);

    checkDictionary(this.display, DISPLAYS, 'Display', 'Box');
  },
});
