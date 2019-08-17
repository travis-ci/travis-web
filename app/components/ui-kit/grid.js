import Component from '@ember/component';
import { reads, match } from '@ember/object/computed';
import prefix from 'travis/utils/ui-kit/prefix';
import concat from 'travis/utils/ui-kit/concat';

export default Component.extend({
  tagName: '',

  // Public interface
  tag: 'div',
  display: 'flex',
  dir: 'row',
  wrap: 'wrap',
  align: 'stretch',
  justify: 'between',
  base: 1,

  // Private
  isRow: match('dir', /^row/),
  isCol: match('dir', /^col/),

  displayClass: reads('display'),
  dirClass: prefix('dir', 'flex'),
  wrapClass: prefix('wrap', 'flex'),
  alignClass: prefix('align', 'items'),
  justifyClass: prefix('justify', 'justify'),

  allClasses: concat(
    'displayClass',
    'dirClass',
    'wrapClass',
    'alignClass',
    'justifyClass',
  ),

});
