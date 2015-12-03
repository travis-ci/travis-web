`import DS from 'ember-data'`
`import config from 'travis/config/environment'`

Adapter = DS.ActiveModelAdapter.extend
  host: config.apiEndpoint
  coalesceFindRequests: true

  ajaxOptions: (url, type, options) ->
    hash = @_super(url, type, options)

    hash.headers ||= {}

    hash.headers['accept'] = 'application/json; version=2'

    if token = Travis.sessionStorage.getItem('travis.token')
      hash.headers['Authorization'] ||= "token #{token}"

    hash

  findMany: (store, type, ids) ->
    @ajax(@buildURL(type.typeKey), 'GET', data: { ids: ids })

  handleResponse: (status, headers, payload) ->
    if status > 299
      console.log "[ERROR] API responded with an error (#{status}): #{JSON.stringify(payload)}"
    return @_super.apply(this, arguments)

`export default Adapter`
