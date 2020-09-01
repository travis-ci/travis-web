import Component from '@ember/component';
import { checkColor } from 'travis/utils/ui-kit/assertions';
import { COLORS, TEXT_COLORS, DEFAULT_TEXT_COLOR } from 'travis/components/ui-kit/text';
import prefix from 'travis/utils/ui-kit/prefix';
import concat from 'travis/utils/ui-kit/concat';

export default Component.extend({
  tagName: '',

  color: DEFAULT_TEXT_COLOR,

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

  // Lifecycle
  didReceiveAttrs() {
    this._super(...arguments);

    checkColor({ value: this.color, dictionary: COLORS, component: 'Link'});
  },
});
