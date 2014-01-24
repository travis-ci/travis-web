require 'travis/model'

@Travis.Broadcast = Travis.Model.extend
  message: Ember.attr('string')

  toObject: ->
    { type: 'broadcast', id: @get('id'), message: @get('message') }

  isSeen: (->
    @get('id') in Travis.Broadcast.seen
  ).property()

  setSeen: ->
    Travis.Broadcast.seen.pushObject(@get('id'))
    Travis.storage.setItem('travis.seen_broadcasts', JSON.stringify(Travis.Broadcast.seen))
    @notifyPropertyChange('isSeen')

@Travis.Broadcast.reopenClass
  seen: (->
    seenBroadcasts = Travis.storage.getItem('travis.seen_broadcasts')
    seenBroadcasts = JSON.parse(seenBroadcasts) if seenBroadcasts?
    Ember.A(seenBroadcasts || [])
  )()

  # TODO fix or monkey-patch the adapter's url and key lookup/generation crap
  # url: 'users/broadcasts'

