`import Ember from 'ember'`

Storage = Em.Object.extend
  init: ->
    @set('storage', {})
  key: (key) ->
    "__#{key.replace('.', '__')}"
  getItem: (k) ->
    return @get("storage.#{@key(k)}")
  setItem: (k,v) ->
    @set("storage.#{@key(k)}", v)
  removeItem: (k) ->
    @setItem(k, null)
  clear: ->
    @set('storage', {})

sessionStorage = (->
  storage = null
  try
    # firefox will not throw error on access for sessionStorage var,
    # you need to actually get something from session
    window.sessionStorage.getItem('foo')
    storage = window.sessionStorage
  catch err
    storage = Storage.create()

  storage
)()

storage = (->
  storage = null
  try
    storage = window.localStorage || throw('no storage')
  catch err
    storage = Storage.create()

  storage
)()

initialize = (container, application) ->
  application.register 'storage:main', storage, { instantiate: false }
  application.register 'sessionStorage:main', sessionStorage, { instantiate: false }

  application.inject('auth', 'storage', 'storage:main')
  application.inject('auth', 'sessionStorage', 'sessionStorage:main')

  # I still use Travis.storage in some places which are not that easy to
  # refactor
  application.storage = storage
  application.sessionStorage = sessionStorage

StorageInitializer =
  name: 'storage'
  before: 'services'
  initialize: initialize

`export {initialize}`
`export default StorageInitializer`
