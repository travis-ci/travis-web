import Component from '@ember/component';

export default Component.extend({
  classNames: ['overlay-backdrop'],
  classNameBindings: ['visible:overlay-backdrop--visible'],

  visible: false
});
