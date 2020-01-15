import Component from '@ember/component';
import { reads } from '@ember/object/computed';

import { checkDictionary } from 'travis/utils/ui-kit/assertions';
import prefix from 'travis/utils/ui-kit/prefix';
import concat from 'travis/utils/ui-kit/concat';

const COLORS = {
  WHITE: 'white',
  GREY_LIGHT: 'grey-light',
};

const BG_COLORS = {
  [COLORS.WHITE]: 'white',
};

const BORDER_COLORS = {
  [COLORS.GREY_LIGHT]: 'grey-150',
};

const WIDTHS = {
  NONE: 'none',
  XS: 'xs',
};

const BORDER_WIDTHS = {
  [WIDTHS.NONE]: 'none',
  [WIDTHS.XS]: 'px',
};

export const DISPLAYS = {
  BLOCK: 'block',
  INLINE: 'inline',
  INLINE_BLOCK: 'inline-block',
  FLEX: 'flex',
};
const DEFAULT_DISPLAY = DISPLAYS.BLOCK;

const TEXT_ALIGNMENTS = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
  JUSTIFY: 'justify',
};

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

// Height & Width
const MAX_WIDTHS = {
  XXS: '2xs',
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
  XXL: '2xl',
  FULL: 'full',
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

  // Private //
  colorClass: prefix('color', 'bg', { dictionary: BG_COLORS }),
  displayClass: prefix('display', ''),
  layerClass: prefix('layer', 'z'),
  overflowAllClass: prefix('overflow.all', 'overflow'),
  overflowXClass: prefix('overflow.x', 'overflow'),
  overflowYClass: prefix('overflow.y', 'overflow'),
  radiusClass: prefix('radius', 'rounded'),
  shadowClass: prefix('shadow', 'shadow'),
  textAlignClass: prefix('textAlign', 'text'),

  widthClass: prefix('width', 'w'),
  maxWidthClass: prefix('maxWidth', 'max-w'),
  heightClass: prefix('height', 'h'),

  // Position
  positionType: reads('position.type'),
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

  // Collected classes
  allClasses: concat(
    'colorClass',
    'displayClass',
    'layerClass',
    'overflowAllClass',
    'overflowXClass',
    'overflowYClass',
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
  ),

  // Lifecycle
  didReceiveAttrs() {
    this._super(...arguments);

    checkDictionary(this.color, COLORS, '@color', 'Box');
    checkDictionary(this.display, DISPLAYS, '@display', 'Box');
    checkDictionary(this.layer, LAYERS, '@layer', 'Box');
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
  },
});
