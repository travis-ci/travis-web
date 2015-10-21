`import Ember from 'ember'`

BroadcastTowerComponent = Ember.Component.extend

  classNames: ['broadcast']

  isOpen: false

  isEmpty: (->
    @get('status') == ''
  ).property('status')

  actions:
    toggleBroadcasts:() ->
      @toggleProperty('isOpen')
      @sendAction('toggleBroadcasts')

      if @get('isOpen') == true
        setTimeout => 
          @toggleProperty('isOpen')
          @sendAction('toggleBroadcasts')
        , 10000

`export default BroadcastTowerComponent`
