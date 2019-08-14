import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { or, none, not } from '@ember/object/computed';
import { checkDictionary } from 'travis/utils/ui-kit/assertions';

// Border
const BORDER_WIDTHS = {
  NONE: 'none',
  ONE: '1',
};

export default Mixin.create({
  // Public interface //
  borderColor: null,
  borderWidth: null,

  // Private //
  get blank() {
    return '';
  },

  hasNoBorderColor: none('borderColor'),
  hasBorderColor: not('hasNoBorderColor'),
  borderColorClass: computed('hasNoBorderColor', 'borderColor', function () {
    return this.hasNoBorderColor ? '' : `border-${this.borderColor}`;
  }),

  borderTopWidth: or('borderWidth.top', 'borderWidth.y', 'borderWidth.all', 'borderWidth', 'blank'),
  borderRightWidth: or('borderWidth.right', 'borderWidth.x', 'borderWidth.all', 'borderWidth', 'blank'),
  borderBottomWidth: or('borderWidth.bottom', 'borderWidth.y', 'borderWidth.all', 'borderWidth', 'blank'),
  borderLeftWidth: or('borderWidth.left', 'borderWidth.x', 'borderWidth.all', 'borderWidth', 'blank'),

  borderTopWidthClass: computed('borderTopWidth', function () {
    return this.borderTopWidth.length === 0 ? '' : `border-t-${this.borderTopWidth}`;
  }),
  borderRightWidthClass: computed('borderRightWidth', function () {
    return this.borderRightWidth.length === 0 ? '' : `border-r-${this.borderRightWidth}`;
  }),
  borderBottomWidthClass: computed('borderBottomWidth', function () {
    return this.borderBottomWidth.length === 0 ? '' : `border-b-${this.borderBottomWidth}`;
  }),
  borderLeftWidthClass: computed('borderLeftWidth', function () {
    return this.borderLeftWidth.length === 0 ? '' : `border-l-${this.borderLeftWidth}`;
  }),

  borderWidthClasses: computed(
    'borderTopWidthClass',
    'borderRightWidthClass',
    'borderBottomWidthClass',
    'borderLeftWidthClass',
    function () {
      return `
        ${this.borderTopWidthClass}
        ${this.borderRightWidthClass}
        ${this.borderBottomWidthClass}
        ${this.borderLeftWidthClass}
      `;
    }
  ),

  // hasNoBorderWidth: none('borderWidth'),
  // borderWidthClass: computed('hasNoBorderWidth', 'hasBorderColor', 'borderWidth', function () {
  //   let currentBorderWidth = this.borderWidth || '';
  //   if (this.hasNoBorderWidth && this.hasBorderColor) {
  //     currentBorderWidth = BASE_BORDER_WIDTH;
  //   }
  //   return currentBorderWidth.length === 0 ? '' : `border-${currentBorderWidth}`;
  // }),

  // Lifecycle
  init() {
    this._super(...arguments);

    checkDictionary(this.borderWidth, BORDER_WIDTHS, '@borderWidth');

    const { top, right, bottom, left } = this.borderWidth || {};
    checkDictionary(top, BORDER_WIDTHS, '@borderWidth.top');
    checkDictionary(right, BORDER_WIDTHS, '@borderWidth.right');
    checkDictionary(bottom, BORDER_WIDTHS, '@borderWidth.bottom');
    checkDictionary(left, BORDER_WIDTHS, '@borderWidth.left');
  },
});
