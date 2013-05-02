jQuery.support.cors = true

Travis.ajax = Em.Object.create
  publicEndpoints: [/\/repos\/?.*/, /\/builds\/?.*/, /\/jobs\/?.*/]

  DEFAULT_OPTIONS:
    accepts:
      json: 'application/vnd.travis-ci.2+json'

  get: (url, callback) ->
    @ajax(url, 'get', success: callback)

  post: (url, data, callback) ->
    @ajax(url, 'post', data: data, success: callback)

  needsAuth: (method, url) ->
    return false if method != 'GET'

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

    options.url = "#{endpoint}#{url}"
    options.type = method
    options.dataType = options.dataType || 'json'
    options.context = this

    if options.data && method != 'GET'
      options.data = JSON.stringify(options.data)

    if method != 'GET' && method != 'HEAD'
      options.contentType = options.contentType || 'application/json; charset=utf-8'

    success = options.success || (->)
    options.success = (data) =>
      Travis.lookup('controller:flash').loadFlashes(data.flash) if data?.flash
      delete data.flash if data?
      success.apply(this, arguments)

    error = options.error || (->)
    options.error = (data) =>
      Travis.lookup('controller:flash').pushObject(data.flash) if data?.flash
      delete data.flash if data?
      error.apply(this, arguments)

    $.ajax($.extend(options, Travis.ajax.DEFAULT_OPTIONS))
