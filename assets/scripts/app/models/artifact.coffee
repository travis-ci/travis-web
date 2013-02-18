require 'travis/model'
require 'travis/chunk_buffer'

@Travis.Artifact = Em.Object.extend
  version: 1 # used to refresh log on requeue
  body: null
  isLoaded: false

  init: ->
    @_super.apply this, arguments

    @addObserver 'job.id', @fetchBody
    @fetchBody()

    @set 'queue', Ember.A([])
    @set 'parts', Ember.ArrayProxy.create(content: [])

    @addObserver 'body', @fetchWorker
    @fetchWorker()

  id: (->
    @get('job.id')
  ).property('job.id')

  clear: ->
    @set('body', '')
    @incrementProperty('version')

  fetchBody: ->
    if jobId = @get('job.id')
      @removeObserver 'job.id', @fetchBody

      self = this
      Travis.ajax.ajax "/jobs/#{jobId}/log.txt?cors_hax=true", 'GET',
        dataType: 'text'
        contentType: 'text/plain'
        success: (data, textStatus, xhr) ->
          if xhr.status == 204
            logUrl = xhr.getResponseHeader('X-Log-Location')

            # For some reason not all browsers can fetch this header
            unless logUrl
              logUrl = self.s3Url("/jobs/#{jobId}/log.txt")

            $.ajax
              url: logUrl
              type: 'GET'
              success: (data) ->
                self.fetchedBody(data)
          else
            self.fetchedBody(data)

  s3Url: (path) ->
    endpoint = Travis.config.api_endpoint
    staging = if endpoint.match(/-staging/) then '-staging' else ''
    host = Travis.config.api_endpoint.replace(/^https?:\/\//, '').split('.').slice(-2).join('.')
    "https://s3.amazonaws.com/archive#{staging}.#{host}#{path}"


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
