import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNameBindings: ['center:loading-container', 'inline:inline-block', 'height:icon-height'],
  center: false
});
