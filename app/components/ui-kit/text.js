import Component from '@ember/component';
import { reads } from '@ember/object/computed';
import { checkDictionary } from 'travis/utils/ui-kit/assertions';
import prefix from 'travis/utils/ui-kit/prefix';
import concat from 'travis/utils/ui-kit/concat';
import spacingMixin from 'travis/mixins/ui-kit/spacing';

const COLORS = {
  BLUE: 'blue',
  GREEN: 'green',
  GREY: 'grey',
  GREY_DARK: 'grey-dark',
};
const DEFAULT_TEXT_COLOR = COLORS.GREY_DARK;

const TEXT_COLORS = {
  [COLORS.BLUE]: 'blue-400',
  [COLORS.GREEN]: 'green-400',
  [COLORS.GREY]: 'grey-400',
  [COLORS.GREY_DARK]: 'grey-800',
};


const FAMILIES = {
  SANS: 'sans',
  SERIF: 'serif',
  MONO: 'mono',
};
const DEFAULT_FAMILY = FAMILIES.SANS;

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
const DEFAULT_SIZE = SIZES.BASE;

const TRANSFORMS = {
  UPPERCASE: 'uppercase',
  LOWERCASE: 'lowercase',
  CAPITALIZE: 'capitalize',
  NORMAL: 'normal-case',
};
const DEFAULT_TRANSFORM = TRANSFORMS.NORMAL;

const WEIGHTS = {
  LIGHT: 'light',
  NORMAL: 'normal',
  SEMIBOLD: 'semibold',
  BOLD: 'bold',
};
const DEFAULT_WEIGHT = WEIGHTS.NORMAL;

// Component definition
export default Component.extend(spacingMixin, {
  tagName: '',

  // Public interface
  tag: 'p',

  color: DEFAULT_TEXT_COLOR,
  family: DEFAULT_FAMILY,
  size: DEFAULT_SIZE,
  transform: DEFAULT_TRANSFORM,
  weight: DEFAULT_WEIGHT,

  // Private
  colorClass: prefix('color', 'text', { dictionary: TEXT_COLORS }),
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

    checkDictionary(this.color, COLORS, '@color', 'Text');
    checkDictionary(this.size, SIZES, '@size', 'Text');
    checkDictionary(this.family, FAMILIES, '@family', 'Text');
    checkDictionary(this.weight, WEIGHTS, '@weight', 'Text');
    checkDictionary(this.transform, TRANSFORMS, '@transform', 'Text');
  },
});
