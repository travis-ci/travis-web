import Component from '@ember/component';
import abstractMethod from 'travis/utils/abstract-method';
import twProps from 'travis/mixins/styleguides/tailwind-props';

export default Component.extend(twProps, {
  tagName: 'button',
  classNames: [],
  classNameBindings: ['disabled'],
  attributeBindings: ['role', 'type'],

  tailwindProps: ['bg', 'font', 'px', 'py', 'rounded', 'text'],
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
