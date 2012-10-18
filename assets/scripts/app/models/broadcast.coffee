require 'travis/model'

@Travis.Broadcast = Travis.Model.extend
  message: DS.attr('string')

  toObject: ->
    { type: 'broadcast', id: @get('id'), message: @get('message') }

@Travis.Broadcast.reopenClass
  # TODO fix or monkey-patch the adapter's url and key lookup/generation crap
  # url: 'users/broadcasts'
