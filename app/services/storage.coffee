`import Ember from 'ember'`
`import Storage from 'travis/utils/hash-storage'`

StorageService = Ember.Service.extend
  init: ->
    storage = null
    try
      storage = window.localStorage || throw('no storage')
    catch err
      storage = Storage.create()

    @set('storage', storage)
  getItem: (key) ->
    return @get("storage").getItem(key)
  setItem: (key, value) ->
    return @get("storage").setItem(key, value)
  removeItem: (key) ->
    return @get("storage").removeItem(key)
  clear: ->
    return @get("storage").clear()

`export default StorageService`
