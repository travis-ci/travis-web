import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

const SHADES = {
  LITE: 100,
  MAIN: 400,
  DARK: 500,
};
const DEFAULT_SHADE = SHADES.MAIN;

const COLORS = {
  BLUE: 'blue',
  GREY: 'grey',
};
const DEFAULT_COLOR = COLORS.BLUE;

const VARIANTS = {
  FILL: 'fill',
  OUTLINE: 'outline',
};
const DEFAULT_VARIANT = VARIANTS.FILL;

function getVariantProps(variant, color, shade) {
  // Fill Variant definition
  if (variant === 'fill') {
    return {
      bg: `bg-${color}-${shade} hover:bg-${color}-${shade + 100}`,
      text: 'text-white',
    };

  // Outline variant definition
  } else if (variant === 'outline') {
    return {
      bg: `hover:bg-${color}-100`,
      text: `text-${color}-${shade}`,
      border: `border border-solid border-${color}-${shade}`,
    };
  }
}

export default Component.extend({
  tagName: '',
  type: 'button',
  role: 'button',

  variant: DEFAULT_VARIANT,
  color: DEFAULT_COLOR,
  shade: DEFAULT_SHADE,

  variantProps: computed('variant', 'color', 'shade', function () {
    const { variant, color, shade } = this;
    return getVariantProps(variant, color, shade);
  }),

  bg: reads('variantProps.bg'),
  text: reads('variantProps.text'),
  border: reads('variantProps.border'),

  generatedClasses: computed('bg', 'text', 'border', function () {
    const { bg, text, border } = this;
    return `
      rounded uppercase px-3 py-2 font-bold
      ${bg || ''} ${text || ''} ${border || ''}
    `;
  }),
});
