import Component from '@ember/component';
import { reads } from '@ember/object/computed';

import spacingMixin from 'travis/mixins/ui-kit/spacing';
import borderMixin from 'travis/mixins/ui-kit/border';
import { checkDictionary } from 'travis/utils/ui-kit/assertions';
import prefix from 'travis/utils/ui-kit/prefix';
import concat from 'travis/utils/ui-kit/concat';

const COLORS = {
  WHITE: 'white',
};

const BG_COLORS = {
  [COLORS.WHITE]: 'white',
};

const DISPLAYS = {
  BLOCK: 'block',
  INLINE_BLOCK: 'inline-block',
  FLEX: 'flex',
};

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
  BASE: 'base',
  NONE: 'none',
};

const RADII = {
  NONE: 'none',
  SM: 'sm',
  BASE: 'base',
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

// Component definition
export default Component.extend(spacingMixin, borderMixin, {
  tagName: '',

  // Public interface //
  tag: 'div',

  color: null,
  display: null,
  layer: null,
  overflow: null,
  radius: null,
  shadow: null,
  textAlign: null,

  borderColor: null,
  borderWidth: null,

  width: null,
  height: null,

  margin: null,
  padding: null,
  position: null,

  // Private //
  colorClass: prefix('color', 'bg', { dictionary: BG_COLORS }),
  displayClass: reads('display'),
  layerClass: prefix('layer', 'z'),
  overflowClass: prefix('overflow', 'overflow'),
  radiusClass: prefix('radius', 'rounded'),
  shadowClass: prefix('shadow', 'shadow'),
  textAlignClass: prefix('textAlign', 'text'),

  widthClass: prefix('width', 'w'),
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
    'overflowClass',
    'radiusClass',
    'shadowClass',
    'textAlignClass',
    'widthClass',
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
    checkDictionary(this.overflow, OVERFLOWS, '@overflow', 'Box');
    checkDictionary(this.radius, RADII, '@radius', 'Box');
    checkDictionary(this.shadow, SHADOWS, '@shadow', 'Box');
    checkDictionary(this.textAlign, TEXT_ALIGNMENTS, '@textAlign', 'Box');

    const { top, right, bottom, left, inset, type } = this.position || {};
    checkDictionary(type, POSITION_TYPES, '@position.type', 'Box');
    checkDictionary(top, POSITION_VALUES, '@position.top', 'Box');
    checkDictionary(right, POSITION_VALUES, '@position.right', 'Box');
    checkDictionary(bottom, POSITION_VALUES, '@position.bottom', 'Box');
    checkDictionary(left, POSITION_VALUES, '@position.left', 'Box');
    checkDictionary(inset, POSITION_INSETS, '@position.inset', 'Box');
  },
});
