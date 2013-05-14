require 'travis/model'
require 'travis/chunk_buffer'

@Travis.Log = Em.Object.extend
  version: 0 # used to refresh log on requeue
  isLoaded: false
  length: 0

  init: ->
    @setParts()

  setParts: ->
    @set 'parts', Ember.ArrayProxy.create(content: [])
    # @set 'parts', Travis.ChunkBuffer.create(content: [])

  fetch: ->
    console.log 'log model: fetching log' if Log.DEBUG
    handlers =
      json: (json) => @loadParts(json['log']['parts'])
      text: (text) => @loadText(text)
    Travis.Log.Request.create(id: id, handlers: handlers).run() if id = @get('job.id')

  clear: ->
    @setParts()
    @incrementProperty('version')

  append: (part) ->
    @get('parts').pushObject(part)

  loadParts: (parts) ->
    console.log 'log model: load parts' if Log.DEBUG
    @append(part) for part in parts
    @set('isLoaded', true)

  loadText: (text) ->
    console.log 'log model: load text' if Log.DEBUG
    @append(number: 1, content: text, final: true)
    @set('isLoaded', true)

Travis.Log.Request = Em.Object.extend
  HEADERS:
    accept: 'application/json; chunked=true; version=2, text/plain; version=2'

  run: ->
    Travis.ajax.ajax "/jobs/#{@id}/log?cors_hax=true", 'GET',
      dataType: 'text'
      headers: @HEADERS
      success: (body, status, xhr) => @handle(body, status, xhr)

  handle: (body, status, xhr) ->
    if xhr.status == 204
      $.ajax(url: @redirectTo(xhr), type: 'GET', success: @handlers.text)
    else if @isJson(xhr, body)
      @handlers.json(body)
    else
      @handlers.text(body)

  redirectTo: (xhr) ->
    # Firefox can't see the Location header on the xhr response due to the wrong
    # status code 204. Should be some redirect code but that doesn't work with CORS.
    xhr.getResponseHeader('Location')

  isJson: (xhr, body) ->
    # Firefox can't see the Content-Type header on the xhr response due to the wrong
    # status code 204. Should be some redirect code but that doesn't work with CORS.
    type = xhr.getResponseHeader('Content-Type') || ''
    type.indexOf('json') > -1
