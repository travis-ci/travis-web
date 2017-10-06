import Component from '@ember/component';

export default Component.extend({
  tagName: 'div',
  classNameBindings: [
    'center:loading-container',
    'inline:inline-block',
    'height:icon-height',
    'white:white'
  ],
  center: false
});
