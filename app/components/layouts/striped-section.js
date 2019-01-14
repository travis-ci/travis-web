import Component from '@ember/component';

export default Component.extend({
  tagName: 'section',
  classNames: ['layout-striped-section'],
  classNameBindings: ['hasBackground:layout-striped-section--with-bg'],

  hasBackground: false
});
