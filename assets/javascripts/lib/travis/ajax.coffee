jQuery.support.cors = true

@Travis.Ajax = Ember.Mixin.create
  DEFAULT_OPTIONS:
    accepts:
      json: 'application/vnd.travis-ci.2+json'

  post: (url, data, callback) ->
    @ajax(url, 'post', data: data, success: callback)

  ajax: (url, method, options) ->
    console.log(url)
    endpoint = Travis.config.api_endpoint || ''
    options = options || {}

    if accessToken = Travis.app?.get('auth.accessToken')
      options.headers ||= {}
      options.headers['Authorization'] ||= "token #{accessToken}"

    options.url = "#{endpoint}#{url}"
    options.type = method
    options.dataType = 'json'
    options.contentType = 'application/json; charset=utf-8'
    options.context = this

    if options.data && method != 'GET' && method != 'get'
      options.data = JSON.stringify(options.data)

    $.ajax($.extend(options, @DEFAULT_OPTIONS))

@Travis.Ajax.instance = Em.Object.create(@Travis.Ajax)

$.extend @Travis,
  get: (url, callback) ->
    @ajax(url, 'get', success: callback)

  post: (url, data, callback) ->
    @Ajax.instance.post(url, data, callback)

  ajax: (url, method, options) ->
    @Ajax.instance.ajax(url, method, options)
