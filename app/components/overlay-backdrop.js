import Component from '@ember/component';
import fade from 'ember-animated/transitions/fade';

export default Component.extend({
  tagName: '',

  isVisible: false,
  position: 'absolute',

  transition: fade,
});
