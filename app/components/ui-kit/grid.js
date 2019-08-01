import Component from '@ember/component';
import { match } from '@ember/object/computed';

export default Component.extend({
  tagName: '',

  // Public interface
  tag: 'div',
  dir: 'row',
  wrap: 'wrap',
  alignItems: 'stretch',
  justify: 'between',
  inline: false,
  base: 1,

  // Private
  isRow: match('dir', /^row/),
  isCol: match('dir', /^col/),
});
