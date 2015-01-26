TextField = Ember.TextField.extend
  keyUp: (event) ->
    @sendAction('action', @get('_value'), event)

  _elementValueDidChange: ->
    @set('_value', @$().val());

fn = (options) ->
  Ember.assert('You can only pass attributes to the `input` helper, not arguments', arguments.length < 2)

  onEvent = options.hash.on
  delete options.hash.on
  options.hash.onEvent = onEvent || 'enter'
  return Ember.Handlebars.helpers.view.call(this, TextField, options)

Travis.Handlebars.filterInput = fn
