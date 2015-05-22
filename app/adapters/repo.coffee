`import Ember from 'ember'`
`import ApplicationAdapter from 'travis/adapters/application'`

Adapter = ApplicationAdapter.extend
  ajaxOptions: (url, type, options) ->
    hash = @_super(url, type, options)

    hash.headers['accept'] = 'application/vnd.travis-ci.3+json'

    hash

  findAll: (store, type, sinceToken) ->
    @_super.apply(this, arguments)


`export default Adapter`
