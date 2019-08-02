import Component from '@ember/component';
import { checkDictionary } from 'travis/utils/ui-kit/assertions';

const FAMILIES = {
  SANS: 'sans',
  SERIF: 'serif',
  MONO: 'mono',
};

const SIZES = {
  XS: 'xs',
  SM: 'sm',
  BASE: 'base',
  LG: 'lg',
  XL: 'xl',
  XL2: '2xl',
  XL3: '3xl',
  XL4: '4xl',
  XL5: '5xl',
  XL6: '6xl',
};

// Component definition
export default Component.extend({

  // Public interface
  tag: 'span',
  family: null,
  size: null,
  color: null,

  // Lifecycle
  init() {
    this._super(...arguments);

    checkDictionary(this.size, SIZES, 'Size', 'Font');
    checkDictionary(this.family, FAMILIES, 'Family', 'Font');
  },
});
