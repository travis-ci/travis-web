require 'models/model'

Model = Travis.Model

Broadcast = Model.extend
  message: DS.attr()

  toObject: ->
    { type: 'broadcast', id: @get('id'), message: @get('message') }

  isSeen: (->
    @get('id') in Broadcast.get('seen')
  ).property()

  setSeen: ->
    Broadcast.get('seen').pushObject(@get('id'))
    Travis.storage.setItem('travis.seen_broadcasts', JSON.stringify(Broadcast.get('seen')))
    @notifyPropertyChange('isSeen')

Broadcast.reopenClass
  seen: (->
    seenBroadcasts = Travis.storage.getItem('travis.seen_broadcasts')
    seenBroadcasts = JSON.parse(seenBroadcasts) if seenBroadcasts?
    Ember.A(seenBroadcasts || [])
  ).property()

  # TODO fix or monkey-patch the adapter's url and key lookup/generation crap
  # url: 'users/broadcasts'

Travis.Broadcast = Broadcast
