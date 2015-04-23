`import Ember from 'ember'`

HookSwitchComponent = Ember.Component.extend
  tagName: 'a'
  classNames: ['travis-switch', 'switch']
  classNameBindings: ['active']
  activeBinding: "hook.active"

  click: ->
    @sendAction('onToggle')
    hook = @get('hook')
    hook.toggle().then( (->), =>
      @toggleProperty('hook.active')
      @sendAction('onToggleError', hook)
    )


`export default HookSwitchComponent`
