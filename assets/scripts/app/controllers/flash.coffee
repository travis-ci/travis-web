Travis.FlashController = Ember.ArrayController.extend
  needs: ['currentUser']
  currentUserBinding: 'controllers.currentUser'

  broadcastBinding: 'currentUser.broadcasts'

  init: ->
    @set('flashes', Ember.A())
    @_super.apply this, arguments

  content: (->
    @get('unseenBroadcasts').concat(@get('flashes'))
  ).property('unseenBroadcasts.length', 'flashes.length')

  unseenBroadcasts: (->
    @get('broadcasts').filterProperty('isSeen', false)
  ).property('broadcasts.isLoaded', 'broadcasts.length')

  broadcasts: (->
    if @get('currentUser') then Travis.Broadcast.find() else Ember.A()
  ).property('currentUser')

  loadFlashes: (msgs) ->
    for msg in msgs
      type = Ember.keys(msg)[0]
      msg = { type: type, message: msg[type] }
      @get('flashes').pushObject(msg)
      Ember.run.later(this, (-> @get('flashes').removeObject(msg)), 15000)

  close: (msg) ->
    if msg instanceof Travis.Broadcast
      msg.setSeen()
      @notifyPropertyChange('unseenBroadcasts')
    else
      @get('flashes').removeObject(msg)

