import Component from '@ember/component';
import { reads } from '@ember/object/computed';

import spacingMixin from 'travis/mixins/ui-kit/spacing';
import borderMixin from 'travis/mixins/ui-kit/border';
import { checkDictionary } from 'travis/utils/ui-kit/assertions';
import prefix from 'travis/utils/ui-kit/prefix';
import concat from 'travis/utils/ui-kit/concat';

const COLORS = {
  WHITE: 'white',
  BLUE_LIGHT: 'blue-light',
  GREY_LIGHT: 'grey-light',
};

const BG_COLORS = {
  [COLORS.WHITE]: 'white',
  [COLORS.BLUE_LIGHT]: 'blue-300',
  [COLORS.GREY_LIGHT]: 'grey-300',
};

const DISPLAYS = {
  BLOCK: 'block',
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
const PIN_LOCATIONS = {
  TOP_RIGHT: 'top-right',
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
  XXXL: '3xl',
  FULL: 'full',
};


// Component definition
export default Component.extend(spacingMixin, borderMixin, {
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

  // Private //
  colorClass: prefix('color', 'bg', { dictionary: BG_COLORS }),
  displayClass: reads('display'),
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
  positionType: reads('position.type'),
  positionTop: prefix('position.top', 'top'),
  positionRight: prefix('position.right', 'right'),
  positionBottom: prefix('position.bottom', 'bottom'),
  positionLeft: prefix('position.left', 'left'),
  positionInset: prefix('position.inset', 'inset'),

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
  },
});
