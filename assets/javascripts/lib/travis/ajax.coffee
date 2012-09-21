jQuery.support.cors = true

@Travis.Ajax = Ember.Mixin.create
  DEFAULT_OPTIONS:
    accepts:
      json: 'application/vnd.travis-ci.2+json'

  post: (url, data, callback) ->
    @ajax(url, 'post', data: data, success: callback)

  ajax: (url, method, options) ->
    endpoint = Travis.config.api_endpoint || ''
    options = options || {}

    if access_token = Travis.app.get('accessToken')
      options.headers ||= {}
      options.headers['Authorization'] ||= "token #{access_token}"

    options.url = "#{endpoint}#{url}"
    options.type = method
    options.dataType = 'json'
    options.contentType = 'application/json; charset=utf-8'
    options.context = this

    if options.data && method != 'GET'
      options.data = JSON.stringify(options.data)

    $.ajax($.extend(options, @DEFAULT_OPTIONS))
