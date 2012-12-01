require 'travis/model'

@Travis.Artifact = Travis.Model.extend
  body: DS.attr('string')
  init: ->
    @_super.apply this, arguments
    @set 'queue', Ember.A([])

    @addObserver 'body', @fetchWorker
    @fetchWorker()

  clear: ->
    @set('body', '')

  append: (body) ->
    if @get('isLoaded')
      @set('body', @get('body') + body)
    else
      @get('queue').pushObject(body)

  recordDidLoad: (->
    if @get('isLoaded')
      queue = @get('queue')
      if queue.get('length') > 0
        @append queue.toArray().join('')
  ).observes('isLoaded')

  fetchWorker: ->
    if body = @get('body')
      line = body.split("\n")[0]
      if line && (match = line.match /Using worker: (.*)/)
        if worker = match[1]
          worker = worker.trim().split(':')[0]
          @set('workerName', worker)
          @removeObserver 'body', @fetchWorker
