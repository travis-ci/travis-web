require 'travis/model'

@Travis.Artifact = Em.Object.extend
  version: 1 # used to refresh log on requeue
  body: null
  isLoaded: false

  init: ->
    @_super.apply this, arguments

    @fetchBody()

    @set 'queue', Ember.A([])
    @set 'parts', Ember.ArrayProxy.create(content: [])

    @addObserver 'body', @fetchWorker
    @fetchWorker()

  clear: ->
    @set('body', '')
    @incrementProperty('version')

  fetchBody: ->
    self = this
    Travis.ajax.ajax "/jobs/#{@get('job.id')}/log.txt?cors_hax=true", 'GET',
      dataType: 'text'
      contentType: 'text/plain'
      success: (data, textStatus, xhr) ->
        if xhr.status == 204
          logUrl = xhr.getResponseHeader('Location')
          $.ajax
            url: logUrl
            type: 'GET'
            success: (data) ->
              self.fetchedBody(data)
        else
          self.fetchedBody(data)

  fetchedBody: (body) ->
    @set 'body', body
    @set 'isLoaded', true

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
