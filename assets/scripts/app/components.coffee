Travis.TravisSwitchComponent = Ember.Component.extend
  tagName: 'a'
  classNames: ['travis-switch']
  classNameBindings: ['_active:active']

  # TODO: how to handle overriding properties to
  #       avoid naming it _action?
  _active: (->
    @get('target.active') || @get('active')
  ).property('target.active', 'active')

  click: ->
    if target = @get('target')
      @set('target.active', !@get('target.active'))
    else
      @set('active', !@get('active'))
    # allow for bindings to propagate
    Ember.run.next this, ->
      @sendAction('action', target)
