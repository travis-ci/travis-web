require 'travis/model'

@Travis.Artifact = Travis.Model.extend
  version: 1 # used to refresh log on requeue
  body: DS.attr('string')
  init: ->
    @_super.apply this, arguments
    @set 'queue', Ember.A([])
    @set 'parts', Ember.ArrayProxy.create(content: [])

    @addObserver 'body', @fetchWorker
    @fetchWorker()

  clear: ->
    @set('body', '')
    @incrementProperty('version')

  append: (body) ->
    if @get('isInitialized')
      @get('parts').pushObject body
      @set('body', @get('body') + body)
    else
      @get('queue').pushObject(body)

  recordDidLoad: (->
    if @get('isLoaded')
      if (body = @get 'body') && @get('parts.length') == 0
        @get('parts').pushObject body

      @set 'isInitialized', true

      queue = @get('queue')
      if queue.get('length') > 0
        @append queue.toArray().join('')
  ).observes('isLoaded')

  fetchWorker: ->
    if !@get('workerName') && (body = @get('body'))
      line = body.split("\n")[0]
      if line && (match = line.match /Using worker: (.*)/)
        if worker = match[1]
          worker = worker.trim().split(':')[0]
          @set('workerName', worker)
          @removeObserver 'body', @fetchWorker
