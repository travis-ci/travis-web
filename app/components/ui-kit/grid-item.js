import Component from '@ember/component';
import { computed } from '@ember/object';
import { or } from '@ember/object/computed';

import { checkDictionary, requireProp } from 'travis/utils/ui-kit/assertions';
import concat from 'travis/utils/ui-kit/concat';
import prefix from 'travis/utils/ui-kit/prefix';

function screenClass(key, screen) {
  return computed('sizePrefix', key, function () {
    const size = this.get(key);
    const screenPrefix = screen === 'base' ? '' : `${screen}:`;

    if (typeof size === 'string') {
      const value = FLEX_SIZE_VALS[size] || `${this.sizePrefix}-${size}`;
      return `${screenPrefix}${value}`;
    }

    if (typeof size === 'number') {
      return `${screenPrefix}${this.sizePrefix}-1/${size}`.replace('1/1', 'full');
    }

    return null;
  });
}

const FLEX_SIZES = {
  GROW_SINGLE: 'grow-single',
  SHRINK_SINGLE: 'shrink-single',
  RESIZE_SINGLE: 'resize-single',
  NONE: 'none',
};
const FLEX_SIZE_VALS = {
  [FLEX_SIZES.GROW_SINGLE]: 'grow-single',
  [FLEX_SIZES.SHRINK_SINGLE]: 'shrink-single',
  [FLEX_SIZES.RESIZE_SINGLE]: 'resize-single',
  [FLEX_SIZES.NONE]: 'none',
};

export default Component.extend({
  tagName: '',

  // Public interface
  componentClass: 'grid-item',
  tag: 'div',
  grid: null,
  base: null,
  sm: null,
  md: null,
  lg: null,
  xl: null,
  gap: null,

  display: null,
  flex: null,
  borderColor: null,
  borderWidth: null,
  margin: null,
  padding: null,

  // Private
  sizePrefix: computed('grid.isCol', function () {
    return this.grid.isCol ? 'h' : 'w';
  }),

  currentBase: or('base', 'grid.base'),
  currentSm: or('sm', 'grid.sm'),
  currentMd: or('md', 'grid.md'),
  currentLg: or('lg', 'grid.lg'),
  currentXl: or('xl', 'grid.xl'),
  currentGap: or('gap', 'grid.gap'),

  baseClass: screenClass('currentBase', 'base'),
  smClass: screenClass('currentSm', 'sm'),
  mdClass: screenClass('currentMd', 'md'),
  lgClass: screenClass('currentLg', 'lg'),
  xlClass: screenClass('currentXl', 'xl'),
  gapClass: computed('currentGap', 'grid.isCol', function () {
    const { currentGap } = this;
    const paddingDir = this.grid.isCol ? 'y' : 'x';

    return currentGap === 0 ? '' : `p${paddingDir}-${currentGap}`;
  }),
  flexClass: prefix('flex', 'flex', { dictionary: FLEX_SIZE_VALS }),

  allClasses: concat(
    'componentClass',
    'baseClass',
    'smClass',
    'mdClass',
    'lgClass',
    'xlClass',
    'gapClass',
    'flexClass'
  ),

  // Lifecycle
  didReceiveAttrs() {
    this._super(...arguments);

    requireProp(this.grid, '@grid', 'GridItem');
    checkDictionary(this.flex, FLEX_SIZES, '@flex', 'GridItem');
  },
});
