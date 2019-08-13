import Component from '@ember/component';
import { computed } from '@ember/object';
import { none } from '@ember/object/computed';
import { checkDictionary } from 'travis/utils/ui-kit/assertions';
import spacingMixin from 'travis/mixins/ui-kit/spacing';

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

const WEIGHTS = {
  LIGHT: 'light',
  NORMAL: 'normal',
  SEMIBOLD: 'semibold',
  BOLD: 'bold',
};

const TRANSFORMS = {
  UPPERCASE: 'uppercase',
  LOWERCASE: 'lowercase',
  CAPITALIZE: 'capitalize',
  NORMAL: 'normal-case',
};

// Component definition
export default Component.extend(spacingMixin, {
  tagName: '',

  // Public interface
  tag: 'span',

  color: null,
  family: null,
  size: null,
  transform: null,
  weight: null,

  // Private
  hasNoFamily: none('family'),
  familyClass: computed('hasNoFamily', 'family', function () {
    return this.hasNoFamily ? '' : `font-${this.family}`;
  }),

  hasNoWeight: none('weight'),
  weightClass: computed('hasNoWeight', 'weight', function () {
    return this.hasNoWeight ? '' : `font-${this.weight}`;
  }),

  hasNoSize: none('size'),
  sizeClass: computed('hasNoSize', 'size', function () {
    return this.hasNoSize ? '' : `text-${this.size}`;
  }),

  hasNoColor: none('color'),
  colorClass: computed('hasNoColor', 'color', function () {
    return this.hasNoColor ? '' : `text-${this.color}`;
  }),

  // Lifecycle
  init() {
    this._super(...arguments);

    checkDictionary(this.size, SIZES, '@size', 'Font');
    checkDictionary(this.family, FAMILIES, '@family', 'Font');
    checkDictionary(this.weight, WEIGHTS, '@weight', 'Font');
    checkDictionary(this.transform, TRANSFORMS, '@transform', 'Font');
  },
});
