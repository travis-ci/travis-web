import Mixin from '@ember/object/mixin';
import { or } from '@ember/object/computed';
import { checkDictionary } from 'travis/utils/ui-kit/assertions';
import prefix from 'travis/utils/ui-kit/prefix';
import concat from 'travis/utils/ui-kit/concat';

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
  borderColorClass: prefix('borderColor', 'border'),

  borderTopWidth: or('borderWidth.top', 'borderWidth.y', 'borderWidth.all'),
  borderRightWidth: or('borderWidth.right', 'borderWidth.x', 'borderWidth.all'),
  borderBottomWidth: or('borderWidth.bottom', 'borderWidth.y', 'borderWidth.all'),
  borderLeftWidth: or('borderWidth.left', 'borderWidth.x', 'borderWidth.all'),

  borderTopWidthClass: prefix('borderTopWidth', 'border-t'),
  borderRightWidthClass: prefix('borderRightWidth', 'border-r'),
  borderBottomWidthClass: prefix('borderBottomWidth', 'border-b'),
  borderLeftWidthClass: prefix('borderLeftWidth', 'border-l'),

  borderWidthClasses: concat(
    'borderTopWidthClass',
    'borderRightWidthClass',
    'borderBottomWidthClass',
    'borderLeftWidthClass',
  ),

  // Lifecycle
  didReceiveAttrs() {
    this._super(...arguments);

    checkDictionary(this.borderWidth, BORDER_WIDTHS, '@borderWidth');

    const { top, right, bottom, left, x, y, all } = this.borderWidth || {};
    checkDictionary(top, BORDER_WIDTHS, '@borderWidth.top');
    checkDictionary(right, BORDER_WIDTHS, '@borderWidth.right');
    checkDictionary(bottom, BORDER_WIDTHS, '@borderWidth.bottom');
    checkDictionary(left, BORDER_WIDTHS, '@borderWidth.left');
    checkDictionary(x, BORDER_WIDTHS, '@borderWidth.x');
    checkDictionary(y, BORDER_WIDTHS, '@borderWidth.y');
    checkDictionary(all, BORDER_WIDTHS, '@borderWidth.all');
  },
});
