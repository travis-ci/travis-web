import Component from '@ember/component';

export default Component.extend({
  tagName: 'div',
  classNameBindings: [
    'center:loading-container',
    'single:loading-single',
    'inline:inline-block',
    'height:icon-height',
    'white:white'
  ],
  center: false,
  single: false
});
