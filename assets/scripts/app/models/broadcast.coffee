require 'travis/model'

@Travis.Broadcast = Travis.Model.extend
  message: DS.attr('string')

  toObject: ->
    { type: 'broadcast', id: @get('id'), message: @get('message') }

  isSeen: (->
    @get('id') in Travis.Broadcast.seen
  ).property()

  setSeen: ->
    Travis.Broadcast.seen.pushObject(@get('id'))
    localStorage.setItem('travis.seen_broadcasts', JSON.stringify(Travis.Broadcast.seen))
    @notifyPropertyChange('isSeen')

@Travis.Broadcast.reopenClass
  seen: Ember.A(JSON.parse(localStorage.getItem('travis.seen_broadcasts')) || [])

  # TODO fix or monkey-patch the adapter's url and key lookup/generation crap
  # url: 'users/broadcasts'

