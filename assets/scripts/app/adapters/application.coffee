Adapter = DS.ActiveModelAdapter.extend
  host: Travis.config.api_endpoint
  ajaxOptions: (url, type, options) ->
    hash = @_super(url, type, options)

    hash.headers ||= {}

    hash.headers['accept'] = 'application/json; version=2'

    token = Travis.sessionStorage.getItem('travis.token')
    hash.headers['Authorization'] ||= "token #{token}"

    hash


Travis.ApplicationAdapter = Adapter
