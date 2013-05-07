jQuery.support.cors = true

Travis.ajax = Em.Object.create
  publicEndpoints: [/\/repos\/?.*/, /\/builds\/?.*/, /\/jobs\/?.*/]

  DEFAULT_OPTIONS:
    accepts:
      json: 'application/json; version=2'

  get: (url, callback) ->
    @ajax(url, 'get', success: callback)

  post: (url, data, callback) ->
    @ajax(url, 'post', data: data, success: callback)

  needsAuth: (method, url) ->
    return true if Travis.ajax.pro
    return true if method != 'GET'

    result = @publicEndpoints.find (pattern) ->
      url.match(pattern)

    !result

  ajax: (url, method, options) ->
    method = method.toUpperCase()

    endpoint = Travis.config.api_endpoint || ''
    options = options || {}

    token = Travis.sessionStorage.getItem('travis.token')
    if token && Travis.ajax.needsAuth(method, url)
      options.headers ||= {}
      options.headers['Authorization'] ||= "token #{token}"

    url = "#{endpoint}#{url}"
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

    options = $.extend(options, Travis.ajax.DEFAULT_OPTIONS)

    if options.data && (method == "GET" || method == "HEAD")
      params = []
      for key, value of options.data
        params.pushObject("#{key}=#{value}")

      params = params.join '&'
      delimeter = if url.indexOf('?') == -1 then '?' else '&'
      url = url + delimeter + params

    xhr = new XMLHttpRequest()

    xhr.open(method, url)

    if options.accepts
      accepts = []
      for key, value of options.accepts
        accepts.pushObject(value)
      xhr.setRequestHeader('Accept', accepts.join(', '))

    if options.headers
      for name, value of options.headers
        xhr.setRequestHeader(name, value)

    if options.contentType
      xhr.setRequestHeader('Content-Type', options.contentType)

    xhr.onreadystatechange = ->
      if xhr.readyState == 4
        contentType = xhr.getResponseHeader('Content-Type')
        data = if contentType && contentType.match /application\/json/
          jQuery.parseJSON(xhr.responseText)
        else
          xhr.responseText

        if xhr.status >= 200 && xhr.status < 300
          options.success.call(options.context, data, xhr.status, xhr)
        else
          options.error.call(data, xhr.status, xhr)

    xhr.send(options.data)
