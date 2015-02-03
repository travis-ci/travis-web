`import Ember from 'ember'`

Component = Ember.Component.extend
  tagName: 'a'
  classNames: ['travis-switch']
  classNameBindings: ['_active:active']

  # TODO: how to handle overriding properties to
  #       avoid naming it _action?
  _active: (->
    @get('target.active') || @get('active')
  ).property('target.active', 'active')

  click: ->
    target = @get('target')
    if @get('toggleAutomatically') != 'false'
      if target
        @set('target.active', !@get('target.active'))
      else
        @set('active', !@get('active'))
    # allow for bindings to propagate
    Ember.run.next this, ->
      @sendAction('action', target)

`export default Component`
