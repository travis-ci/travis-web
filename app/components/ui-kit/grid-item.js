import Component from '@ember/component';
import { computed } from '@ember/object';
import { or } from '@ember/object/computed';
import { requireProp } from 'travis/utils/ui-kit/assertions';
import concat from 'travis/utils/ui-kit/concat';

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
  INITIAL: 'initial',
  EVEN: 'even',
  AUTO: 'auto',
  NONE: 'none',
};
const FLEX_SIZE_VALS = {
  [FLEX_SIZES.INITIAL]: 'flex-initial',
  [FLEX_SIZES.EVEN]: 'flex-1',
  [FLEX_SIZES.AUTO]: 'flex-auto',
  [FLEX_SIZES.NONE]: 'flex-none',
};

export default Component.extend({
  tagName: '',

  // Public interface
  tag: 'div',
  grid: null,
  base: null,
  sm: null,
  md: null,
  lg: null,
  xl: null,

  // Private
  sizePrefix: computed('grid.isCol', function () {
    return this.grid.isCol ? 'h' : 'w';
  }),

  currentBase: or('base', 'grid.base'),
  currentSm: or('sm', 'grid.sm'),
  currentMd: or('md', 'grid.md'),
  currentLg: or('lg', 'grid.lg'),
  currentXl: or('xl', 'grid.xl'),

  baseClass: screenClass('currentBase', 'base'),
  smClass: screenClass('currentSm', 'sm'),
  mdClass: screenClass('currentMd', 'md'),
  lgClass: screenClass('currentLg', 'lg'),
  xlClass: screenClass('currentXl', 'xl'),

  allClasses: concat(
    'baseClass',
    'smClass',
    'mdClass',
    'lgClass',
    'xlClass',
  ),

  // Lifecycle
  didReceiveAttributes() {
    this._super(...arguments);

    requireProp(this.grid, '@grid', 'GridItem');
  },
});
