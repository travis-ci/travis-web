import Component from '@ember/component';
import { variantProp } from 'travis/utils/ui-kit/variant';
import { COLORS as BG_COLOR_NAMES } from 'travis/components/ui-kit/box';
import { COLORS as TEXT_COLOR_NAMES } from 'travis/components/ui-kit/text';

// Variants
const VARIANTS = {
  WARN: 'warn',
};
const VARIANT_PROPS = {
  [VARIANTS.WARN]: {
    bgColor: BG_COLOR_NAMES.YELLOW_LIGHTER,
    textColor: TEXT_COLOR_NAMES.YELLOW_DARK,
  },
};
export default Component.extend({
  tagName: '',

  // Public interface
  tag: 'div',

  bgColor: variantProp(VARIANT_PROPS, null),
  textColor: variantProp(VARIANT_PROPS, null),

  variant: null,
});
