import Ember from 'ember';

var TextField = Ember.TextField.extend({
  keyUp(event) {
    return this.sendAction('action', this.get('_value'), event);
  },

  _elementValueDidChange() {
    return this.set('_value', this.$().val());
  }
});

export default function(params, hash, options, env) {
  var onEvent;
  Ember.assert('You can only pass attributes to the `input` helper, not arguments', params.length);
  onEvent = hash.on;
  delete hash.on;
  hash.onEvent = onEvent || 'enter';
  return env.helpers.view.helperFunction.call(this, [TextField], hash, options, env);
}
