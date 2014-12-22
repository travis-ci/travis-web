require 'travis/model'
require 'travis/log_chunks'

@Travis.Log = Em.Object.extend
  version: 0 # used to refresh log on requeue
  isLoaded: false
  length: 0

  fetchMissingParts: (partNumbers, after) ->
    return if @get('notStarted')

    data = {}
    data['part_numbers'] = partNumbers if partNumbers
    data['after'] = after if after

    Travis.ajax.ajax "/jobs/#{@get('job.id')}/log", 'GET',
      dataType: 'json'
      headers:
        accept: 'application/json; chunked=true; version=2'
      data: data
      success: (body, status, xhr) =>
        Ember.run this, ->
          if parts = body.log.parts
            for part in parts
              @append part

  parts: (->
    #if Travis.config.pusher_log_fallback
    #  Travis.LogChunks.create(content: [], missingPartsCallback: => @fetchMissingParts.apply(this, arguments))
    #else
    Ember.ArrayProxy.create(content: [])
  ).property()

  clearParts: ->
    parts = @get('parts')
    @notifyPropertyChange('parts')
    parts.destroy()

  fetch: ->
    console.log 'log model: fetching log' if Log.DEBUG
    @clearParts()
    handlers =
      json: (json) => @loadParts(json['log']['parts'])
      text: (text) => @loadText(text)
    Travis.Log.Request.create(id: id, handlers: handlers).run() if id = @get('job.id')

  clear: ->
    @clearParts()
    @incrementProperty('version')

  append: (part) ->
    return if @get('parts').isDestroying || @get('parts').isDestroyed
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
      success: (body, status, xhr) => Ember.run(this, -> @handle(body, status, xhr))

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
