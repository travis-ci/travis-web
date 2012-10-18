Travis.FlashController = Ember.ArrayController.extend
  broadcastBinding: 'Travis.app.currentUser.broadcasts'

  init: ->
    @_super.apply this, arguments
    @set('content', Ember.A())

  broadcasts: (->
    Travis.Broadcast.find() if Travis.app.get('currentUser')
  ).property('Travis.app.currentUser')

  broadcastsObserver: (->
    if broadcasts = @get('broadcasts')
      broadcasts.forEach (msg) => @pushObject(msg.toObject()) unless @isSeenBroadcast(msg)
  ).observes('broadcasts.length')

  loadFlashes: (msgs) ->
    for msg in msgs
      type = Ember.keys(msg)[0]
      msg = { type: type, message: msg[type] }
      @pushObject(msg)
      Ember.run.later(this, (-> @removeObject(msg)), 15000)

  close: (msg) ->
    @storeSeenBroadcast(msg) if msg.type == 'broadcast'
    @removeObject(msg)

  isSeenBroadcast: (msg) ->
    msg.get('id') in @seenBroadcasts()

  seenBroadcasts: ->
    seen = localStorage.getItem('travis.seen_broadcasts')
    if seen then JSON.parse(seen) else []

  storeSeenBroadcast: (msg) ->
    seen = @seenBroadcasts()
    seen.push(msg.id)
    localStorage.setItem('travis.seen_broadcasts', JSON.stringify(seen))
