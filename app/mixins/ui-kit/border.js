import Mixin from '@ember/object/mixin';
import { or } from '@ember/object/computed';
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
  [WIDTHS.XS]: '1',
};

const COLORS = {
  GREY_LIGHT: 'grey-light',
};

const BORDER_COLORS = {
  [COLORS.GREY_LIGHT]: 'grey-150',
};

export default Mixin.create({
  // Public interface //
  borderColor: null,
  borderWidth: null,

  // Private //
  borderColorClass: prefix('borderColor', 'border', { dictionary: BORDER_COLORS }),

  borderTopWidth: or('borderWidth.top', 'borderWidth.y', 'borderWidth.all'),
  borderRightWidth: or('borderWidth.right', 'borderWidth.x', 'borderWidth.all'),
  borderBottomWidth: or('borderWidth.bottom', 'borderWidth.y', 'borderWidth.all'),
  borderLeftWidth: or('borderWidth.left', 'borderWidth.x', 'borderWidth.all'),

  borderTopWidthClass: prefix('borderTopWidth', 'border-t', { dictionary: BORDER_WIDTHS }),
  borderRightWidthClass: prefix('borderRightWidth', 'border-r', { dictionary: BORDER_WIDTHS }),
  borderBottomWidthClass: prefix('borderBottomWidth', 'border-b', { dictionary: BORDER_WIDTHS }),
  borderLeftWidthClass: prefix('borderLeftWidth', 'border-l', { dictionary: BORDER_WIDTHS }),

  borderWidthClasses: concat(
    'borderTopWidthClass',
    'borderRightWidthClass',
    'borderBottomWidthClass',
    'borderLeftWidthClass',
  ),

  // Lifecycle
  didReceiveAttrs() {
    this._super(...arguments);

    checkDictionary(this.borderColor, COLORS, '@borderColor');

    const { top, right, bottom, left, x, y, all } = this.borderWidth || {};
    checkDictionary(top, WIDTHS, '@borderWidth.top');
    checkDictionary(right, WIDTHS, '@borderWidth.right');
    checkDictionary(bottom, WIDTHS, '@borderWidth.bottom');
    checkDictionary(left, WIDTHS, '@borderWidth.left');
    checkDictionary(x, WIDTHS, '@borderWidth.x');
    checkDictionary(y, WIDTHS, '@borderWidth.y');
    checkDictionary(all, WIDTHS, '@borderWidth.all');
  },
});
