import Component from '@ember/component';

export default Component.extend({
  tagName: 'activation-section',
  classNames: ['layout-activation-section'],
  classNameBindings: ['hasBackground:layout-activation-section--with-bg'],

  hasBackground: false
});
