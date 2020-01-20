import Mixin from '@ember/object/mixin';
import { checkDictionary } from 'travis/utils/ui-kit/assertions';
import prefix from 'travis/utils/ui-kit/prefix';
import concat from 'travis/utils/ui-kit/concat';

// Border
const WIDTHS = {
  NONE: 'none',
  XS: 'xs',
};

const BORDER_WIDTHS = {
  [WIDTHS.NONE]: 'none',
  [WIDTHS.XS]: 'px',
};

const COLORS = {
  BLUE: 'blue',
  GREEN: 'green',
  GREY: 'grey',
  GREY_LIGHT: 'grey-light',
  GREY_DARK: 'grey-dark',
};

const BORDER_COLORS = {
  [COLORS.BLUE]: 'blue-400',
  [COLORS.GREEN]: 'green-300',
  [COLORS.GREY]: 'grey-700',
  [COLORS.GREY_LIGHT]: 'grey-150',
  [COLORS.GREY_DARK]: 'grey-800',
};

export default Mixin.create({
  // Public interface //
  borderColor: null,
  borderWidth: null,

  // Public exports //
  borderColorClass: prefix('borderColor', 'border', { dictionary: BORDER_COLORS }),

  borderWidthClasses: concat(
    'borderAllWidthClass',
    'borderTopWidthClass',
    'borderRightWidthClass',
    'borderBottomWidthClass',
    'borderLeftWidthClass',
  ),

  // Private //
  borderAllWidthClass: prefix('borderWidth.all', 'border', { dictionary: BORDER_WIDTHS }),

  borderTopWidthClass: prefix('borderWidth.top', 'border-t', { dictionary: BORDER_WIDTHS }),
  borderRightWidthClass: prefix('borderWidth.right', 'border-r', { dictionary: BORDER_WIDTHS }),
  borderBottomWidthClass: prefix('borderWidth.bottom', 'border-b', { dictionary: BORDER_WIDTHS }),
  borderLeftWidthClass: prefix('borderWidth.left', 'border-l', { dictionary: BORDER_WIDTHS }),

  // Lifecycle
  didReceiveAttrs() {
    this._super(...arguments);

    checkDictionary(this.borderColor, COLORS, '@borderColor');

    const { top, right, bottom, left, all } = this.borderWidth || {};
    checkDictionary(top, WIDTHS, '@borderWidth.top');
    checkDictionary(right, WIDTHS, '@borderWidth.right');
    checkDictionary(bottom, WIDTHS, '@borderWidth.bottom');
    checkDictionary(left, WIDTHS, '@borderWidth.left');
    checkDictionary(all, WIDTHS, '@borderWidth.all');
  },
});
