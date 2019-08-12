import Component from '@ember/component';
import { checkDictionary } from 'travis/utils/ui-kit/assertions';
import spacingMixin from 'travis/mixins/ui-kit/spacing';
import { computed } from '@ember/object';
import { none, reads } from '@ember/object/computed';

const DISPLAYS = {
  BLOCK: 'block',
  INLINE_BLOCK: 'inline-block',
  FLEX: 'flex',
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

// Position
const POSITION_TYPES = {
  STATIC: 'static',
  FIXED: 'fixed',
  ABSOLUTE: 'absolute',
  RELATIVE: 'relative',
  STICKY: 'sticky',
};
const POSITION_VALUES = {
  ZERO: '0',
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
export default Component.extend(spacingMixin, {
  tagName: '',

  // Public interface //
  tag: 'div',

  bgColor: null,
  display: null,
  layer: null,
  shadow: null,

  width: null,
  height: null,

  margin: null,
  position: null,

  // Private //

  hasNoBgColor: none('bgColor'),
  bgColorClass: computed('hasNoBgColor', 'bgColor', function () {
    return this.hasNoBgColor ? '' : `bg-${this.bgColor}`;
  }),

  displayClass: reads('display'),

  hasNoLayer: none('layer'),
  layerClass: computed('hasNoLayer', 'layer', function () {
    return this.hasNoLayer ? '' : `z-${this.layer}`;
  }),

  hasNoShadow: none('shadow'),
  shadowClass: computed('hasNoShadow', 'isBaseShadow', 'shadow', function () {
    return this.hasNoShadow ? '' : `shadow-${this.shadow}`;
  }),

  // Width & Height
  hasNoWidth: none('width'),
  widthClass: computed('hasNoWidth', 'width', function () {
    return this.hasNoWidth ? '' : `w-${this.width}`;
  }),

  hasNoHeight: none('height'),
  heightClass: computed('hasNoHeight', 'height', function () {
    return this.hasNoHeight ? '' : `h-${this.height}`;
  }),

  // Position
  hasNoPositionType: none('position.type'),
  positionType: computed('hasNoPositionType', 'position.type', function () {
    return this.hasNoPositionType ? '' : this.position.type;
  }),

  hasNoPositionTop: none('position.top'),
  positionTop: computed('hasNoPositionTop', 'position.top', function () {
    return this.hasNoPositionTop ? '' : `top-${this.position.top}`;
  }),

  hasNoPositionRight: none('position.right'),
  positionRight: computed('hasNoPositionRight', 'position.right', function () {
    return this.hasNoPositionRight ? '' : `right-${this.position.right}`;
  }),

  hasNoPositionBottom: none('position.top'),
  positionBottom: computed('hasNoPositionBottom', 'position.top', function () {
    return this.hasNoPositionBottom ? '' : `top-${this.position.top}`;
  }),

  hasNoPositionLeft: none('position.left'),
  positionLeft: computed('hasNoPositionLeft', 'position.left', function () {
    return this.hasNoPositionLeft ? '' : `left-${this.position.left}`;
  }),

  hasNoPositionInset: none('position.inset'),
  positionInset: computed('hasNoPositionInset', 'position.inset', function () {
    return this.hasNoPositionInset ? '' : `inset-${this.position.inset}`;
  }),

  positionClasses: computed(
    'positionType',
    'positionTop',
    'positionRight',
    'positionBottom',
    'positionLeft',
    'positionX',
    'positionY',
    function () {
      return `
        ${this.positionType}
        ${this.positionTop}
        ${this.positionRight}
        ${this.positionBottom}
        ${this.positionLeft}
        ${this.positionInset}
      `;
    }
  ),

  // Lifecycle
  init() {
    this._super(...arguments);

    checkDictionary(this.display, DISPLAYS, '@display', 'Box');
    checkDictionary(this.layer, LAYERS, '@layer', 'Box');
    checkDictionary(this.shadow, SHADOWS, '@shadow', 'Box');

    const { top, right, bottom, left, inset, type } = this.position || {};
    checkDictionary(type, POSITION_TYPES, '@position.type', 'Box');
    checkDictionary(top, POSITION_VALUES, '@position.top', 'Box');
    checkDictionary(right, POSITION_VALUES, '@position.right', 'Box');
    checkDictionary(bottom, POSITION_VALUES, '@position.bottom', 'Box');
    checkDictionary(left, POSITION_VALUES, '@position.left', 'Box');
    checkDictionary(inset, POSITION_INSETS, '@position.inset', 'Box');
  },
});
