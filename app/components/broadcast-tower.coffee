`import Ember from 'ember'`

BroadcastTowerComponent = Ember.Component.extend

  classNames: ['broadcast']

  isOpen: false
  timeoutId: ''

  actions:
    toggleBroadcasts:() ->
      @toggleProperty('isOpen')
      @sendAction('toggleBroadcasts')

      if @get('isOpen') == true
        @set('timeoutId', setTimeout => 
            @toggleProperty('isOpen')
            @sendAction('toggleBroadcasts')
          , 10000
        )
      else
        clearTimeout(@get('timeoutId'))

`export default BroadcastTowerComponent`
