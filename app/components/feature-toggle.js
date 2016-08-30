import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'a',
  classNames: ['switch--icon'],
  classNameBindings: ['feature.enabled:active', 'disabled:disabled', 'disabled:inline-block'],
  click() {
    this.sendAction('onToggle', this.get('feature'));
  }
});
