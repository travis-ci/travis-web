require 'models'

@Travis.RestAdapter = DS.RESTAdapter.extend
  DEFAULT_OPTIONS:
    accepts:
      json: 'application/vnd.travis-ci.2+json'

  mappings:
    repositories: Travis.Repository
    builds: Travis.Build
    commits: Travis.Commit
    jobs: Travis.Job

  plurals:
    repository: 'repositories',
    build: 'builds'
    branch: 'branches'
    job: 'jobs'
    worker: 'workers'

  ajax: (url, method, options) ->
    @_super(url, method, $.extend(options, @DEFAULT_OPTIONS))

  # init: ->
  #   @_super()

  # find: (store, type, id) ->
  #   url = '/' + type.buildURL(id)
  #   # console.log "find: #{url}"
  #   @ajax url, 'GET',
  #     success: (json) =>
  #       @loadOne(store, type, json)

  # findMany: (store, type, ids) ->
  #   url = '/' + type.buildURL()
  #   query = { ids: ids }
  #   # console.log "findMany: #{url}"
  #   @ajax url, 'GET',
  #     data: query
  #     success: (json) =>
  #       @loadMany(store, type, json)

  # findAll: (store, type) ->
  #   url = '/' + type.buildURL()
  #   # console.log "findAll: #{url}"
  #   @ajax url, 'GET',
  #     success: (json) =>
  #       @loadMany(store, type, json)

  # findQuery: (store, type, query, recordArray) ->
  #   url = '/' + type.buildURL()
  #   # console.log "findQuery: #{url} (#{query})"
  #   @ajax url, 'GET',
  #     data: query,
  #     success: (json) =>
  #       @loadQuery(store, type, json, recordArray)

  # updateRecord: (store, type, record) ->
  #   id = get(record, record.get('primaryKey') || 'id')
  #   url = '/' + type.buildURL(id)
  #   data = { root: record.toJSON() }
  #   @ajax url, 'PUT',
  #     data: data
  #     success: (json) =>
  #       loadUpdatedRecord(store, type, record)

  # loadOne: (store, type, json) ->
  #   root = type.singularName()
  #   @sideload(store, type, json, root)
  #   store.load(type, json[root])

  # loadMany: (store, type, json) ->
  #   root = type.pluralName()
  #   @sideload(store, type, json, root)
  #   store.loadMany(type, json[root])

  # loadQuery: (store, type, json, recordArray) ->
  #   root = type.pluralName()
  #   @sideload(store, type, json, root)
  #   recordArray.load(json[root])

  # loadUpdatedRecord: (store, type, json) ->
  #   root = type.singularName()
  #   @sideload(store, type, json, root)
  #   store.didUpdateRecord(record, json && json[root])


