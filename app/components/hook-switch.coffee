`import Ember from 'ember'`

HookSwitchComponent = Ember.Component.extend
  tagName: 'a'
  classNames: ['switch--icon']
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
