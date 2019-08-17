import Component from '@ember/component';
import { reads } from '@ember/object/computed';
import { checkDictionary } from 'travis/utils/ui-kit/assertions';
import prefix from 'travis/utils/ui-kit/prefix';
import concat from 'travis/utils/ui-kit/concat';
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
  colorClass: prefix('color', 'text'),
  familyClass: prefix('family', 'font'),
  sizeClass: prefix('size', 'text'),
  transformClass: reads('transform'),
  weightClass: prefix('weight', 'font'),

  allClasses: concat(
    'colorClass',
    'familyClass',
    'sizeClass',
    'transformClass',
    'weightClass',
    'marginClasses',
    'paddingClasses',
  ),

  // Lifecycle
  didReceiveAttrs() {
    this._super(...arguments);

    checkDictionary(this.size, SIZES, '@size', 'Font');
    checkDictionary(this.family, FAMILIES, '@family', 'Font');
    checkDictionary(this.weight, WEIGHTS, '@weight', 'Font');
    checkDictionary(this.transform, TRANSFORMS, '@transform', 'Font');
  },
});
