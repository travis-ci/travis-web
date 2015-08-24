`import Ember from 'ember'`
`import StorageService from 'travis/services/storage'`
`import Storage from 'travis/utils/hash-storage'`

SessionStorageService = StorageService.extend
  init: ->
    storage = null
    try
      # firefox will not throw error on access for sessionStorage var,
      # you need to actually get something from session
      window.sessionStorage.getItem('foo')
      storage = window.sessionStorage
    catch err
      storage = Storage.create()

    @set('storage', storage)

`export default SessionStorageService`
