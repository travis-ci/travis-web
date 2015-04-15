`import Ember from 'ember'`
`import Model from 'travis/models/model'`

Broadcast = Model.extend
  message: DS.attr()

  toObject: ->
    { type: 'broadcast', id: @get('id'), message: @get('message') }

  isSeen: (->
    @get('id') in Ember.get(Broadcast, 'seen')
  ).property()

  setSeen: ->
    Ember.get(Broadcast, 'seen').pushObject(@get('id'))
    Travis.storage.setItem('travis.seen_broadcasts', JSON.stringify(Ember.get(Broadcast, 'seen')))
    @notifyPropertyChange('isSeen')

Broadcast.reopenClass
  seen: (->
    seenBroadcasts = Travis.storage.getItem('travis.seen_broadcasts')
    seenBroadcasts = JSON.parse(seenBroadcasts) if seenBroadcasts?
    Ember.A(seenBroadcasts || [])
  ).property()

  # TODO fix or monkey-patch the adapter's url and key lookup/generation crap
  # url: 'users/broadcasts'

`export default Broadcast`
