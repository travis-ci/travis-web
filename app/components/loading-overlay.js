import Component from '@ember/component';

export default Component.extend({
  classNames: ['loading-overlay'],
  classNameBindings: ['visible:loading-overlay--visible'],

  visible: false

});
