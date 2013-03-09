require 'travis/model'
require 'travis/chunk_buffer'

@Travis.Artifact = Em.Object.extend
  version: 1 # used to refresh log on requeue
  body: null
  isLoaded: false

  init: ->
    @_super.apply this, arguments

    @addObserver 'job.id', @fetch
    @fetch()

    @set 'parts', Travis.ChunkBuffer.create(content: [])

  id: (->
    @get('job.id')
  ).property('job.id')

  willDestroy: ->
    @get('parts').destroy()

  clear: ->
    @set('body', '')
    @incrementProperty('version')
    @get('parts').destroy()
    @set 'parts', Travis.ChunkBuffer.create(content: [])

  fetch: ->
    if jobId = @get('job.id')
      @removeObserver 'job.id', @fetch

      handlers =
        json: (json) => @loadParts(json['log']['parts'])
        text: (text) => @loadText(text)

      Travis.Artifact.Request.create(id: id, handlers: handlers).run() if id = @get('job.id')

  append: (part) ->
    @fetchWorker Ember.get(part, 'content')
    @get('parts').pushObject(part)

  loadParts: (parts) ->
    console.log 'artifact model: load parts'
    @append(part) for part in parts
    @set('isLoaded', true)

  loadText: (text) ->
    console.log 'artifact model: load text'
    number = -1
    @append(number: 1, content: text)
    @set('isLoaded', true)

  fetchWorker: (string) ->
    if !@get('workerName')
      line = string.split("\n")[0]
      if line && (match = line.match /Using worker: (.*)/)
        if worker = match[1]
          worker = worker.trim().split(':')[0]
          @set('workerName', worker)

Travis.Artifact.Request = Em.Object.extend
  HEADERS:
    accept: 'application/vnd.travis-ci.2+json; chunked=true; version=2, text/plain; version=2'

  run: ->
    Travis.ajax.ajax "/jobs/#{@id}/log?cors_hax=true", 'GET',
      dataType: 'text'
      headers: @HEADERS
      success: (body, status, xhr) => @handle(body, status, xhr)

  handle: (body, status, xhr) ->
    if xhr.status == 204
      $.ajax(url: @redirectTo(xhr), type: 'GET', success: @handlers.text)
    else if @isJson(xhr, body)
      @handlers.json(JSON.parse(body))
    else
      @handlers.text(body)

  redirectTo: (xhr) ->
    # Firefox can't see the Location header on the xhr response due to the wrong
    # status code 204. Should be some redirect code but that doesn't work with CORS.
    xhr.getResponseHeader('Location') || @s3Url()

  s3Url: ->
    endpoint = Travis.config.api_endpoint
    staging = if endpoint.match(/-staging/) then '-staging' else ''
    host = endpoint.replace(/^https?:\/\//, '').split('.').slice(-2).join('.')
    "https://s3.amazonaws.com/archive#{staging}.#{host}#{path}/jobs/#{@id}/log.txt"

  isJson: (xhr, body) ->
    # Firefox can't see the Content-Type header on the xhr response due to the wrong
    # status code 204. Should be some redirect code but that doesn't work with CORS.
    type = xhr.getResponseHeader('Content-Type') || ''
    type.indexOf('json') > -1 || body.slice(0, 8) == '{"log":{'
