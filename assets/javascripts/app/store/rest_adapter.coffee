require 'models'

@Travis.RestAdapter = DS.RESTAdapter.extend
  init: ->
    @_super()
    # TODO should be able to specify these as strings
    @set 'mappings',
      builds: Travis.Build,
      commits: Travis.Commit,
      jobs: Travis.Job

  plurals:
    repository: 'repositories',
    branch: 'branches'

  find: (store, type, id) ->
    url = '/' + type.buildURL(id)
    # console.log "find: #{url}"

    @ajax url, 'GET',
      success: (json) ->
        root = type.singularName()
        @sideload(store, type, json, root)
        store.load(type, json[root])
      accepts:
        json: 'application/vnd.travis-ci.2+json'

  findMany: (store, type, ids) ->
    url = '/' + type.buildURL()
    # console.log "findMany: #{url}"

    @ajax url, 'GET',
      data:
        ids: ids
      success: (json) ->
        root = type.pluralName()
        @sideload(store, type, json, root)
        store.loadMany(type, json[root])
      accepts:
        json: 'application/vnd.travis-ci.2+json'

  findAll: (store, type) ->
    url = '/' + type.buildURL()
    # console.log "findAll: #{url}"

    @ajax url, 'GET',
      success: (json) ->
        root = type.pluralName()
        @sideload(store, type, json, root)
        store.loadMany(type, json[root])
      accepts:
        json: 'application/vnd.travis-ci.2+json'

  findQuery: (store, type, query, recordArray) ->
    url = '/' + type.buildURL()
    # console.log "findQuery: #{url} (#{query})"

    @ajax url, 'GET',
      data: query,
      success: (json) ->
        root = type.pluralName()
        @sideload(store, type, json, root)
        recordArray.load(json[root])
      accepts:
        json: 'application/vnd.travis-ci.2+json'

  updateRecord: (store, type, record) ->
    id = get(record, record.get('primaryKey') || 'id')
    url = '/' + type.buildURL(id)
    data = root: record.toJSON()

    @ajax url, 'PUT',
      data: data
      success: (json) ->
        root = type.singularName()
        @sideload(store, type, json, root)
        store.didUpdateRecord(record, json && json[root])
