import Component from '@ember/component';
import { checkColor } from 'travis/utils/ui-kit/assertions';
import { variantProp } from 'travis/utils/ui-kit/variant';
import { VARIANT_PROPS, COLORS, TEXT_COLORS, DEFAULT_TEXT_COLOR } from 'travis/components/ui-kit/text';
import prefix from 'travis/utils/ui-kit/prefix';
import concat from 'travis/utils/ui-kit/concat';

export default Component.extend({
  tagName: '',

  color: variantProp(VARIANT_PROPS, DEFAULT_TEXT_COLOR),

  colorClass: prefix('color', 'text', { dictionary: TEXT_COLORS }),

  // Public interface
  variant: 'link-underlined',

  allClasses: concat(
    'colorClass'
  ),

  href: null,
  rel: 'noopener noreferrer',
  target: '_blank',

  route: null,
  disabled: 'false',

  // Lifecycle
  didReceiveAttrs() {
    this._super(...arguments);

    checkColor({ value: this.color, dictionary: COLORS, component: 'Link'});
  },
});
