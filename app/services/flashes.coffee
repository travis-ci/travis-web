`import Ember from 'ember'`
`import LimitedArray from 'travis/utils/limited-array'`

FlashesService = Ember.Service.extend
  store: Ember.inject.service()

  currentUserBinding: 'auth.currentUser'

  init: ->
    @_super.apply this, arguments
    @set('flashes', LimitedArray.create(limit: 1, content: []))

  messages: (->
    flashes = @get('flashes')
    model = []
    model.pushObjects(flashes.toArray().reverse()) if flashes
    model.uniq()
  ).property('flashes.[]', 'flashes.length')

  loadFlashes: (msgs) ->
    for msg in msgs
      type = Object.keys(msg)[0]
      msg = { type: type, message: msg[type] }
      @get('flashes').unshiftObject(msg)
      Ember.run.later(this, (-> @get('flashes.content').removeObject(msg)), 15000)

  close: (msg) ->
    @get('flashes').removeObject(msg)

`export default FlashesService`
