Travis.TravisSwitchComponent = Ember.Component.extend
  tagName: 'a'
  classNames: ['travis-switch']
  classNameBindings: ['active']

  activeBinding: 'target.active'

  click: ->
    @sendAction('action', @get('target'))
