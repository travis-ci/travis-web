`import Ember from 'ember';`
`import config from 'travis/config/environment'`

jQuery.support.cors = true

default_options =
  accepts:
    json: 'application/json; version=2'

Ajax = Ember.Service.extend
  auth: Ember.inject.service()

  publicEndpoints: [/\/repos\/?.*/, /\/builds\/?.*/, /\/jobs\/?.*/]
  privateEndpoints: [/\/repos\/\d+\/caches/]

  get: (url, callback, errorCallback) ->
    @ajax(url, 'get', success: callback, error: errorCallback)

  post: (url, data, callback) ->
    @ajax(url, 'post', data: data, success: callback)

  patch: (url, data, callback) ->
    @ajax(url, 'patch', data: data, success: callback)

  needsAuth: (method, url) ->
    return true if config.pro
    return true if method != 'GET'

    publicEndpoint = @publicEndpoints.find (pattern) ->
      url.match(pattern)

    privateEndpoint = @privateEndpoints.find (pattern) ->
      url.match(pattern)

    !publicEndpoint || privateEndpoint

  ajax: (url, method, options) ->
    # TODO: we have our own ajax implementation, because jQuery didn't
    #       properly worked with headers on firefox, it would be nice to check
    #       if this is still a problem and if we can remove this
    method = method || "GET"
    method = method.toUpperCase()

    endpoint = config.apiEndpoint || ''
    options = options || {}

    token = Ember.get(this, 'auth').token()
    if token && (@needsAuth(method, url) || options.forceAuth)
      options.headers ||= {}
      options.headers['Authorization'] ||= "token #{token}"

    options.url = url = "#{endpoint}#{url}"
    options.type = method
    options.dataType = options.dataType || 'json'
    options.context = this

    if options.data && method != 'GET'
      options.data = JSON.stringify(options.data)

    if method != 'GET' && method != 'HEAD'
      options.contentType = options.contentType || 'application/json; charset=utf-8'

    success = options.success || (->)
    options.success = (data, status, xhr) =>
      Travis.lookup('controller:flash').loadFlashes(data.flash) if data?.flash
      delete data.flash if data?
      success.apply(this, arguments)

    error = options.error || (->)
    options.error = (data, status, xhr) =>
      Travis.lookup('controller:flash').pushObject(data.flash) if data?.flash
      delete data.flash if data?
      error.apply(this, arguments)

    options = $.extend(options, default_options)

    if testMode?
      console.log('Running ajax with', options.url)

      # we use jquery.mockjax for test, I don't want to hack it or rewrite it,
      # so let's just pretend we still use ajax if testing mode is on
      return new Ember.RSVP.Promise( (resolve, reject) ->
        oldSuccess = options.success
        options.success = (json, status, xhr) ->
          Ember.run this, ->
            oldSuccess.call(this, json, status, xhr)
          Ember.run(null, resolve, json)

        oldError = options.error
        options.error = (jqXHR) ->
          if jqXHR
            # for a context, please see https://github.com/emberjs/ember.js/issues/3051
            jqXHR.then = null

          Ember.run this, ->
            oldError.call this, jqXHR
            reject(jqXHR)

        $.ajax(options)
      )

    if options.data && (method == "GET" || method == "HEAD")
      params = jQuery.param(options.data)
      delimeter = if url.indexOf('?') == -1 then '?' else '&'
      url = url + delimeter + params

    xhr = new XMLHttpRequest()

    xhr.open(method, url)

    if options.accepts && !options.headers?.accept?
      accepts = []
      for key, value of options.accepts
        accepts.pushObject(value)
      xhr.setRequestHeader('Accept', accepts.join(', '))

    if options.headers
      for name, value of options.headers
        xhr.setRequestHeader(name, value)

    if options.contentType
      xhr.setRequestHeader('Content-Type', options.contentType)

    resolve = null
    reject = null
    promise = new Ember.RSVP.Promise( (_resolve, _reject) ->
      resolve = _resolve
      reject = _reject
    )

    xhr.onreadystatechange = ->
      if xhr.readyState == 4
        contentType = xhr.getResponseHeader('Content-Type')
        data = if contentType && contentType.match /application\/json/
          try
            jQuery.parseJSON(xhr.responseText)
          catch e
            console.log('error while parsing a response', method, options.url, xhr.responseText)
        else
          xhr.responseText

        if xhr.status >= 200 && xhr.status < 300
          resolve(data)
          options.success.call(options.context, data, xhr.status, xhr)
        else
          reject(xhr)
          options.error.call(data, xhr.status, xhr)

    data = options.data
    if typeof(options.data) == "object" && (Ember.isNone(options.contentType) || options.contentType.match /application\/json/)
      data = JSON.stringify(data)

    xhr.send(data)

    return promise

`export default Ajax`
