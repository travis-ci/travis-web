import Component from '@ember/component';
import { checkColor, checkDictionary } from 'travis/utils/ui-kit/assertions';
import prefix from 'travis/utils/ui-kit/prefix';
import concat from 'travis/utils/ui-kit/concat';
import { variantProp } from 'travis/utils/ui-kit/variant';
import { BORDER_WIDTHS } from 'travis/components/ui-kit/box';

export const ALIGNMENTS = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
  JUSTIFY: 'justify',
};

export const COLORS = {
  BLUE_LIGHT: 'blue-light',
  BLUE: 'blue',
  GREEN_LIGHT: 'green-light',
  GREEN: 'green',
  GREY: 'grey',
  GREY_DARK: 'grey-dark',
  YELLOW_DARK: 'yellow-dark',
  WHITE: 'white',
  GREY_CONCRETE: 'grey-concrete',
  OXIDE_BLUE: 'oxide-blue',
};
export const DEFAULT_TEXT_COLOR = COLORS.GREY_DARK;

const TEXT_COLORS = {
  [COLORS.BLUE_LIGHT]: 'blue-300',
  [COLORS.BLUE]: 'blue-400',
  [COLORS.GREEN_LIGHT]: 'green-300',
  [COLORS.GREEN]: 'green-400',
  [COLORS.GREY]: 'grey-400',
  [COLORS.GREY_DARK]: 'grey-800',
  [COLORS.YELLOW_DARK]: 'yellow-600',
  [COLORS.WHITE]: 'white',
  [COLORS.GREY_CONCRETE]: 'grey-concrete',
  [COLORS.OXIDE_BLUE]: 'oxide-blue',
};

const FAMILIES = {
  SANS: 'sans',
  SERIF: 'serif',
  MONO: 'mono',
};
const DEFAULT_FAMILY = FAMILIES.SANS;

const LEADINGS = {
  NONE: 'none',
  XS2: '2xs',
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
};
const DEFAULT_LEADING = LEADINGS.MD;

const LINES = {
  UNDER: 'under',
  THROUGH: 'through',
  NONE: 'none',
};
const DEFAULT_LINE = LINES.NONE;

const DECORATIONS = {
  [LINES.UNDER]: 'underline',
  [LINES.THROUGH]: 'line-through',
  [LINES.NONE]: 'no-underline',
};

const SIZES = {
  XS3: '3xs',
  XS2: '2xs',
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
  XL2: '2xl',
  XL3: '3xl',
  XL4: '4xl',
  XL5: '5xl',
  XL6: '6xl',
};
const DEFAULT_SIZE = SIZES.MD;

const TRACKINGS = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
};
const DEFAULT_TRACKING = TRACKINGS.MD;

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

// Variants
const VARIANTS = {
  SMALLCAPS: 'smallcaps',
  H1: 'h1',
  H2: 'h2',
  P: 'p',
  LINK_BLUE: 'link-blue',
  LINK_OXIDE_BLUE: 'link-oxide-blue',
  LINK_UNDER: 'link-underlined',
  LINK_UNDER_HOVER: 'link-underlined-hover',
};
export const VARIANT_PROPS = {
  [VARIANTS.SMALLCAPS]: {
    size: 'xs',
    tracking: 'lg',
    weight: 'bold',
    transform: 'uppercase',
  },
  [VARIANTS.H1]: {
    leading: { base: 'none', md: 'md'},
    margin: { bottom: 3 },
    size: '6xl',
    weight: 'bold',
  },
  [VARIANTS.H2]: {
    leading: 'xs',
    margin: { bottom: 3 },
    size: '5xl',
    weight: 'bold',
  },
  [VARIANTS.P]: {
    margin: { bottom: 4 },
  },
  [VARIANTS.LINK_BLUE]: {
    color: 'blue',
  },
  [VARIANTS.LINK_OXIDE_BLUE]: {
    color: 'oxide-blue',
  },
  [VARIANTS.LINK_UNDER]: {
    borderWidth: { bottom: 'px' },
  },
  [VARIANTS.LINK_UNDER_HOVER]: {
    hoverBorderWidth: { bottom: 'px' }
  },
};

// Component definition
export default Component.extend({
  tagName: '',

  // Public interface
  tag: 'p',

  align: variantProp(VARIANT_PROPS, null),
  color: variantProp(VARIANT_PROPS, DEFAULT_TEXT_COLOR),
  family: variantProp(VARIANT_PROPS, DEFAULT_FAMILY),
  leading: variantProp(VARIANT_PROPS, DEFAULT_LEADING),
  line: variantProp(VARIANT_PROPS, DEFAULT_LINE),
  size: variantProp(VARIANT_PROPS, DEFAULT_SIZE),
  tracking: variantProp(VARIANT_PROPS, DEFAULT_TRACKING),
  transform: variantProp(VARIANT_PROPS, DEFAULT_TRANSFORM),
  weight: variantProp(VARIANT_PROPS, DEFAULT_WEIGHT),

  borderColor: variantProp(VARIANT_PROPS, null),
  borderWidth: variantProp(VARIANT_PROPS, null),
  hoverBorderWidth: variantProp(VARIANT_PROPS, null),
  display: variantProp(VARIANT_PROPS, null),
  margin: variantProp(VARIANT_PROPS, null),
  maxWidth: variantProp(VARIANT_PROPS, null),
  padding: variantProp(VARIANT_PROPS, null),
  flex: variantProp(VARIANT_PROPS, null),

  variant: null,

  // Private
  alignClass: prefix('align', 'text'),
  colorClass: prefix('color', 'text', { dictionary: TEXT_COLORS }),
  familyClass: prefix('family', 'font'),
  leadingClass: prefix('leading', 'leading'),
  lineClass: prefix('line', '', { dictionary: DECORATIONS }),
  sizeClass: prefix('size', 'text'),
  trackingClass: prefix('tracking', 'tracking'),
  transformClass: prefix('transform'),
  weightClass: prefix('weight', 'font'),

  // Hover border
  hoverBorderAllWidthClass: prefix('hoverBorderWidth.all', 'hover-border', { dictionary: BORDER_WIDTHS }),
  hoverBorderTopWidthClass: prefix('hoverBorderWidth.top', 'hover-border-t', { dictionary: BORDER_WIDTHS }),
  hoverBorderRightWidthClass: prefix('hoverBorderWidth.right', 'hover-border-r', { dictionary: BORDER_WIDTHS }),
  hoverBorderBottomWidthClass: prefix('hoverBorderWidth.bottom', 'hover-border-b', { dictionary: BORDER_WIDTHS }),
  hoverBorderLeftWidthClass: prefix('hoverBorderWidth.left', 'hover-border-l', { dictionary: BORDER_WIDTHS }),
  hoverBorderWidthClasses: concat(
    'hoverBorderAllWidthClass',
    'hoverBorderTopWidthClass',
    'hoverBorderRightWidthClass',
    'hoverBorderBottomWidthClass',
    'hoverBorderLeftWidthClass',
  ),

  allClasses: concat(
    'alignClass',
    'colorClass',
    'familyClass',
    'leadingClass',
    'lineClass',
    'sizeClass',
    'trackingClass',
    'transformClass',
    'weightClass',
    'hoverBorderWidthClasses',
  ),

  // Lifecycle
  didReceiveAttrs() {
    this._super(...arguments);

    checkDictionary(this.align, ALIGNMENTS, '@align', 'Text');
    checkColor({ value: this.color, dictionary: COLORS, component: 'Text'});
    checkDictionary(this.size, SIZES, '@size', 'Text');
    checkDictionary(this.family, FAMILIES, '@family', 'Text');
    checkDictionary(this.leading, LEADINGS, '@leading', 'Text');
    checkDictionary(this.line, LINES, '@line', 'Text');
    checkDictionary(this.weight, WEIGHTS, '@weight', 'Text');
    checkDictionary(this.tracking, TRACKINGS, '@tracking', 'Text');
    checkDictionary(this.transform, TRANSFORMS, '@transform', 'Text');
    checkDictionary(this.variant, VARIANTS, '@variant', 'Text');
  },
});
