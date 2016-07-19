import Ember from 'ember';

const TextField = Ember.TextField.extend({
  keyUp(event) {
    return this.sendAction('action', this.get('_value'), event);
  },

  _elementValueDidChange() {
    return this.set('_value', this.$().val());
  }
});

export default function (params, hash, options, env) {
  Ember.assert('You can only pass attributes to the `input` helper, not arguments', params.length);
  const onEvent = hash.on;
  delete hash.on;
  hash.onEvent = onEvent || 'enter';
  return env.helpers.view.helperFunction.call(this, [TextField], hash, options, env);
}
