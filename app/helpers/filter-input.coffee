`import Ember from 'ember'`

TextField = Ember.TextField.extend
  keyUp: (event) ->
    @sendAction('action', @get('_value'), event)

  _elementValueDidChange: ->
    @set('_value', @$().val());

fn = (params, hash, options, env) ->
  Ember.assert('You can only pass attributes to the `input` helper, not arguments', params.length)

  onEvent = hash.on
  delete hash.on
  hash.onEvent = onEvent || 'enter'
  env.helpers.view.helperFunction.call(this, [TextField], hash, options, env)

`export default fn`
