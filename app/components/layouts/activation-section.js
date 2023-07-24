import Component from '@ember/component';

export default Component.extend({
  tagName: 'activation-section',
  classNames: ['layout-activation-section'],
  classNameBindings: ['isHeader:layout-activation-section--header'],

  isHeader: false
});
