import Component from '@ember/component';
import { checkDictionary } from 'travis/utils/ui-kit/assertions';
import prefix from 'travis/utils/ui-kit/prefix';
import concat from 'travis/utils/ui-kit/concat';
import { ALIGNMENTS as TEXT_ALIGNMENTS } from 'travis/components/ui-kit/text';

export const COLORS = {
  WHITE: 'white',
  BLUE_LIGHT: 'blue-light',
  BLUE: 'blue',
  GREEN: 'green',
  GREY_LIGHTEST: 'grey-lightest',
  GREY_LIGHTER: 'grey-lighter',
  GREY_LIGHT: 'grey-light',
  GREY: 'grey',
  GREY_DARK: 'grey-dark',
  YELLOW_LIGHTER: 'yellow-lighter',
  YELLOW_LIGHT: 'yellow-light',
  RED: 'red-300',
  RED_LIGHT: 'red-90',
};

const BG_COLORS = {
  [COLORS.WHITE]: 'white',
  [COLORS.BLUE_LIGHT]: 'blue-300',
  [COLORS.GREY_LIGHTEST]: 'grey-100',
  [COLORS.GREY_LIGHTER]: 'grey-150',
  [COLORS.GREY_LIGHT]: 'grey-300',
  [COLORS.GREY_DARK]: 'grey-800',
  [COLORS.BLUE]: 'blue-400',
  [COLORS.YELLOW_LIGHT]: 'yellow-200',
  [COLORS.YELLOW_LIGHTER]: 'yellow-100',
};

const BORDER_COLORS = {
  [COLORS.WHITE]: 'white',
  [COLORS.BLUE]: 'blue-400',
  [COLORS.GREEN]: 'green-300',
  [COLORS.GREY_LIGHT]: 'grey-150',
  [COLORS.GREY]: 'grey-700',
  [COLORS.GREY_DARK]: 'grey-800',
  [COLORS.RED]: 'red-300',
  [COLORS.RED_LIGHT]: 'red-90',
};

const WIDTHS = {
  NONE: 'none',
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
};

const BORDER_WIDTHS = {
  [WIDTHS.NONE]: 'none',
  [WIDTHS.XS]: 'px',
  [WIDTHS.SM]: 'sm',
  [WIDTHS.MD]: 'md',
};

export const DISPLAYS = {
  BLOCK: 'block',
  INLINE: 'inline',
  INLINE_BLOCK: 'inline-block',
  FLEX: 'flex',
};
const DEFAULT_DISPLAY = DISPLAYS.BLOCK;

const LAYERS = {
  AUTO: 'auto',
  ZERO: '0',
  TEN: '10',
  TWENTY: '20',
  THIRTY: '30',
  FORTY: '40',
  FIFTY: '50',
};

const SHADOWS = {
  SM: 'sm',
  MD: 'md',
  NONE: 'none',
};

const RADII = {
  NONE: 'none',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  FULL: 'full',
};

const OVERFLOWS = {
  AUTO: 'auto',
  HIDDEN: 'hidden',
};

// Position
const POSITION_TYPES = {
  STATIC: 'static',
  FIXED: 'fixed',
  ABSOLUTE: 'absolute',
  RELATIVE: 'relative',
  STICKY: 'sticky',
};
const POSITION_VALUES = {
  ZERO: 0,
  AUTO: 'auto',
};
const POSITION_INSETS = {
  ZERO: '0',
  X_ZERO: 'x-0',
  Y_ZERO: 'y-0',
  AUTO: 'auto',
  X_AUTO: 'x-auto',
  Y_AUTO: 'y-auto',
};
const PIN_LOCATIONS = {
  TOP_RIGHT: 'top-right',
  TOP_LEFT: 'top-left',
};

// Height & Width
const MAX_WIDTHS = {
  XS2: '2xs',
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
  XL2: '2xl',
  XL3: '3xl',
  XL5: '5xl',
  XL6: '6xl',
  FULL: 'full',
};

// Flexbox
const FLEX_ALIGNMENTS = {
  STRETCH: 'stretch',
  START: 'start',
  CENTER: 'center',
  END: 'end',
  BASELINE: 'baseline',
};

const FLEX_JUSTIFICATIONS = {
  START: 'start',
  CENTER: 'center',
  END: 'end',
  BETWEEN: 'between',
  AROUND: 'around',
};

const FLEX_DIRECTIONS = {
  ROW: 'row',
  COL: 'col',
  ROW_REVERSE: 'row-reverse',
  COL_REVERSE: 'col-reverse',
};

const FLEX_WRAPS = {
  wrap: 'wrap',
  NO_WRAP: 'no-wrap',
};

export const FLEX_SIZES = {
  GROW_SINGLE: 'grow-single',
  SHRINK_SINGLE: 'shrink-single',
  RESIZE_SINGLE: 'resize-single',
  NONE: 'none',
  SHRINK_ZERO: 'shrink-none',
};
export const FLEX_SIZE_VALS = {
  [FLEX_SIZES.GROW_SINGLE]: 'grow-single',
  [FLEX_SIZES.SHRINK_SINGLE]: 'shrink-single',
  [FLEX_SIZES.RESIZE_SINGLE]: 'resize-single',
  [FLEX_SIZES.NONE]: 'none',
  [FLEX_SIZES.SHRINK_ZERO]: 'shrink-0',
};

// Component definition
export default Component.extend({
  tagName: '',

  // Public interface //
  tag: 'div',

  color: null,
  display: DEFAULT_DISPLAY,
  layer: null,
  overflow: null,
  pin: null,
  radius: null,
  shadow: null,
  textAlign: null,

  borderColor: null,
  borderWidth: null,

  width: null,
  maxWidth: null,
  height: null,

  margin: null,
  padding: null,
  position: null,

  flexAlign: null,
  flexJustify: null,
  flexDir: null,
  flexWrap: null,

  // Private //
  colorClass: prefix('color', 'bg', { dictionary: BG_COLORS }),
  displayClass: prefix('display', ''),
  layerClass: prefix('layer', 'z'),
  overflowAllClass: prefix('overflow.all', 'overflow'),
  overflowXClass: prefix('overflow.x', 'overflow'),
  overflowYClass: prefix('overflow.y', 'overflow'),
  pinClass: prefix('pin', 'pin'),
  radiusClass: prefix('radius', 'rounded'),
  shadowClass: prefix('shadow', 'shadow'),
  textAlignClass: prefix('textAlign', 'text'),

  widthClass: prefix('width', 'w'),
  maxWidthClass: prefix('maxWidth', 'max-w'),
  heightClass: prefix('height', 'h'),

  // Position
  positionType: prefix('position.type', ''),
  positionTop: prefix('position.top', 'top'),
  positionRight: prefix('position.right', 'right'),
  positionBottom: prefix('position.bottom', 'bottom'),
  positionLeft: prefix('position.left', 'left'),
  positionInset: prefix('position.inset', 'inset'),

  // Border
  borderAllWidthClass: prefix('borderWidth.all', 'border', { dictionary: BORDER_WIDTHS }),
  borderTopWidthClass: prefix('borderWidth.top', 'border-t', { dictionary: BORDER_WIDTHS }),
  borderRightWidthClass: prefix('borderWidth.right', 'border-r', { dictionary: BORDER_WIDTHS }),
  borderBottomWidthClass: prefix('borderWidth.bottom', 'border-b', { dictionary: BORDER_WIDTHS }),
  borderLeftWidthClass: prefix('borderWidth.left', 'border-l', { dictionary: BORDER_WIDTHS }),
  borderColorClass: prefix('borderColor', 'border', { dictionary: BORDER_COLORS }),
  borderWidthClasses: concat(
    'borderAllWidthClass',
    'borderTopWidthClass',
    'borderRightWidthClass',
    'borderBottomWidthClass',
    'borderLeftWidthClass',
  ),

  // Margin
  marginTop: prefix('margin.top', 'mt', { negatable: true }),
  marginRight: prefix('margin.right', 'mr', { negatable: true }),
  marginBottom: prefix('margin.bottom', 'mb', { negatable: true }),
  marginLeft: prefix('margin.left', 'ml', { negatable: true }),
  marginX: prefix('margin.x', 'mx', { negatable: true }),
  marginY: prefix('margin.y', 'my', { negatable: true }),
  marginAll: prefix('margin.all', 'm', { negatable: true }),
  marginClasses: concat(
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
    'marginX',
    'marginY',
    'marginAll',
  ),

  // Padding
  paddingTop: prefix('padding.top', 'pt'),
  paddingRight: prefix('padding.right', 'pr'),
  paddingBottom: prefix('padding.bottom', 'pb'),
  paddingLeft: prefix('padding.left', 'pl'),
  paddingX: prefix('padding.x', 'px'),
  paddingY: prefix('padding.y', 'py'),
  paddingAll: prefix('padding.all', 'p'),
  paddingClasses: concat(
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'paddingX',
    'paddingY',
    'paddingAll',
  ),

  // Flex
  flexAlignClass: prefix('flexAlign', 'items'),
  flexJustifyClass: prefix('flexJustify', 'justify'),
  flexDirClass: prefix('flexDir', 'flex'),
  flexWrapClass: prefix('flexWrap', 'flex'),
  flexClass: prefix('flex', 'flex', { dictionary: FLEX_SIZE_VALS }),

  // Collected classes
  allClasses: concat(
    'colorClass',
    'displayClass',
    'layerClass',
    'overflowAllClass',
    'overflowXClass',
    'overflowYClass',
    'pinClass',
    'radiusClass',
    'shadowClass',
    'textAlignClass',
    'widthClass',
    'maxWidthClass',
    'heightClass',
    'positionType',
    'positionTop',
    'positionRight',
    'positionBottom',
    'positionLeft',
    'positionInset',
    'borderColorClass',
    'borderWidthClasses',
    'marginClasses',
    'paddingClasses',
    'flexAlignClass',
    'flexJustifyClass',
    'flexDirClass',
    'flexWrapClass',
    'flexClass',
  ),

  // Lifecycle
  didReceiveAttrs() {
    this._super(...arguments);

    checkDictionary(this.color, COLORS, '@color', 'Box');
    checkDictionary(this.display, DISPLAYS, '@display', 'Box');
    checkDictionary(this.layer, LAYERS, '@layer', 'Box');
    checkDictionary(this.pin, PIN_LOCATIONS, '@pin', 'Box');
    checkDictionary(this.radius, RADII, '@radius', 'Box');
    checkDictionary(this.shadow, SHADOWS, '@shadow', 'Box');
    checkDictionary(this.textAlign, TEXT_ALIGNMENTS, '@textAlign', 'Box');
    checkDictionary(this.maxWidth, MAX_WIDTHS, '@maxWidth', 'Box');

    const { top, right, bottom, left, inset, type } = this.position || {};
    checkDictionary(type, POSITION_TYPES, '@position.type', 'Box');
    checkDictionary(top, POSITION_VALUES, '@position.top', 'Box');
    checkDictionary(right, POSITION_VALUES, '@position.right', 'Box');
    checkDictionary(bottom, POSITION_VALUES, '@position.bottom', 'Box');
    checkDictionary(left, POSITION_VALUES, '@position.left', 'Box');
    checkDictionary(inset, POSITION_INSETS, '@position.inset', 'Box');

    const { all, x, y } = this.overflow || {};
    checkDictionary(all, OVERFLOWS, '@overflow.all', 'Box');
    checkDictionary(x, OVERFLOWS, '@overflow.x', 'Box');
    checkDictionary(y, OVERFLOWS, '@overflow.y', 'Box');

    checkDictionary(this.borderColor, COLORS, '@borderColor');

    const bw = this.borderWidth || {};
    checkDictionary(bw.top, WIDTHS, '@borderWidth.top');
    checkDictionary(bw.right, WIDTHS, '@borderWidth.right');
    checkDictionary(bw.bottom, WIDTHS, '@borderWidth.bottom');
    checkDictionary(bw.left, WIDTHS, '@borderWidth.left');
    checkDictionary(bw.all, WIDTHS, '@borderWidth.all');

    checkDictionary(this.flexAlign, FLEX_ALIGNMENTS, '@flexAlign', 'Box');
    checkDictionary(this.flexJustify, FLEX_JUSTIFICATIONS, '@flexJustify', 'Box');
    checkDictionary(this.flexDir, FLEX_DIRECTIONS, '@flexDir', 'Box');
    checkDictionary(this.flexWrap, FLEX_WRAPS, '@flexWrap', 'Box');
    checkDictionary(this.flex, FLEX_SIZES, '@flex', 'Box');
  },
});
