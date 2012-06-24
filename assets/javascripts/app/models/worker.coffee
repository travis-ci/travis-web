require 'travis/model'

@Travis.WorkerGroup = Ember.ArrayProxy.extend
  init: ->
    @set('content', [])

  host: (->
    @getPath 'firstObject.host'
  ).property()

@Travis.Worker = Travis.Model.extend
  state: DS.attr('string')
  name: DS.attr('string')
  host: DS.attr('string')
  lastSeenAt: DS.attr('string')

  isTesting: (->
    @get('state') == 'working' && !!@getPath('payload.config')
  ).property('state', 'config')

  number: (->
    @get('name').match(/\d+$/)[0]
  ).property('name')

  display: (->
    name    = @get('name').replace('travis-', '')
    state   = @get('state')
    payload = @get('payload')
    if state == 'working' && payload != undefined
      repo   = if payload.repository then $.truncate(payload.repository.slug, 18) else undefined
      number = if payload.build and payload.build.number then ' #' + payload.build.number else ''
      state  = if repo then repo + number else state
    name + ': ' + state
  ).property('state')

  urlJob: (->
    '#!/%@/jobs/%@'.fmt @getPath('payload.repository.slug'), @getPath('payload.build.id')
  ).property('payload', 'state')
