`import Ember from 'ember'`
`import LimitedArray from 'travis/utils/limited-array'`

FlashesService = Ember.Service.extend
  store: Ember.inject.service()

  currentUserBinding: 'auth.currentUser'

  init: ->
    @_super.apply this, arguments
    @set('flashes', LimitedArray.create(limit: 1, content: []))

  messages: (->
    #broadcasts = @get('unseenBroadcasts')
    flashes = @get('flashes')
    model = []
    # model.pushObjects(broadcasts) if broadcasts
    model.pushObjects(flashes.toArray().reverse())    if flashes
    model.uniq()
  ).property('flashes.[]', 'flashes.length')

  # unseenBroadcasts: (->
  #   @get('broadcasts').filter (broadcast) ->
  #     !broadcast.get('isSeen')
  # ).property('broadcasts.[]', 'broadcasts.length')

  # broadcasts: (->
  #   broadcasts = Ember.ArrayProxy.create(content: [])

  #   if @get('currentUser.id')
  #     @get('store').find('broadcast').then (result) ->
  #       broadcasts.pushObjects(result.toArray())

  #   broadcasts
  # ).property('currentUser.id')

  loadFlashes: (msgs) ->
    for msg in msgs
      type = Object.keys(msg)[0]
      msg = { type: type, message: msg[type] }
      @get('flashes').unshiftObject(msg)
      Ember.run.later(this, (-> @get('flashes.content').removeObject(msg)), 15000)

  close: (msg) ->
    # if msg.constructor.modelName == "broadcast"
    #   msg.setSeen()
    #   @notifyPropertyChange('unseenBroadcasts')
    # else
    @get('flashes').removeObject(msg)

`export default FlashesService`
