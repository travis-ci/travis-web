import Component from '@ember/component';
import { computed } from '@ember/object';
import abstractMethod from 'travis/utils/abstract-method';
import twProps from 'travis/mixins/styleguides/tailwind-props';
import generatePropVariants from 'travis/utils/tailwind-variants';

const styleProps = ['bg', 'font', 'px', 'py', 'rounded', 'text'];
const generatedProps = generatePropVariants(styleProps);

export default Component.extend(twProps, {
  tagName: 'button',
  classNames: [],
  classNameBindings: ['disabled'],
  attributeBindings: ['role', 'type'],

  tailwindProps: computed(...generatedProps, function () {
    return generatedProps.filter(prop => typeof this[prop] !== 'undefined');
  }),
  bg: 'grey-700',
  font: 'bold',
  px: 3,
  py: '2',
  rounded: true,
  text: 'white',

  type: 'button',
  role: 'button',
  disabled: false,

  onToggle: abstractMethod('onToggle'),

  click() {
    if (!this.disabled) {
      this.onToggle(!this.active);
    }
  }
});
