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
  [WIDTHS.XS]: 'px',
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

  // Public exports //
  borderColorClass: prefix('borderColor', 'border', { dictionary: BORDER_COLORS }),

  borderWidthClasses: concat(
    'borderTopWidthClass',
    'borderRightWidthClass',
    'borderBottomWidthClass',
    'borderLeftWidthClass',
  ),

  // Private //
  borderAllTop: prefix('borderWidth.all', 'border-t', { dictionary: BORDER_WIDTHS }),
  borderAllRht: prefix('borderWidth.all', 'border-r', { dictionary: BORDER_WIDTHS }),
  borderAllBtm: prefix('borderWidth.all', 'border-b', { dictionary: BORDER_WIDTHS }),
  borderAllLft: prefix('borderWidth.all', 'border-l', { dictionary: BORDER_WIDTHS }),

  borderTop: prefix('borderWidth.top', 'border-t', { dictionary: BORDER_WIDTHS }),
  borderRht: prefix('borderWidth.right', 'border-r', { dictionary: BORDER_WIDTHS }),
  borderBtm: prefix('borderWidth.bottom', 'border-b', { dictionary: BORDER_WIDTHS }),
  borderLft: prefix('borderWidth.left', 'border-l', { dictionary: BORDER_WIDTHS }),

  borderTopWidthClass: or('borderTop', 'borderAllTop'),
  borderRightWidthClass: or('borderRht', 'borderAllRht'),
  borderBottomWidthClass: or('borderBtm', 'borderAllBtm'),
  borderLeftWidthClass: or('borderLft', 'borderAllLft'),

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
