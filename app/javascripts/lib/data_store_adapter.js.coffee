@Travis.FixtureAdapter = DS.Adapter.extend
  find: (store, type, id) ->
    fixtures = type.FIXTURES
    Ember.assert "Unable to find fixtures for model type " + type.toString(), !!fixtures
    return  if fixtures.hasLoaded
    setTimeout (->
      store.loadMany type, fixtures
      fixtures.hasLoaded = true
    ), 300

  findMany: ->
    @find.apply this, arguments

  findAll: (store, type) ->
    fixtures = type.FIXTURES
    Ember.assert "Unable to find fixtures for model type " + type.toString(), !!fixtures
    ids = fixtures.map (item, index, self) ->
      item.id
    store.loadMany type, ids, fixtures

  findQuery: (store, type, params, array) ->
    fixtures = type.FIXTURES
    Ember.assert "Unable to find fixtures for model type " + type.toString(), !!fixtures
    hashes = for fixture in fixtures
      matches = for key, value of params
        key == 'orderBy' || fixture[key] == value
      if matches.reduce((a, b) -> a && b) then fixture else null
    array.load(hashes.compact())

@Travis.DataStoreAdapter = DS.RESTAdapter.extend
  init: ->
    @_super()
    # TODO should be able to specify these as strings
    @set 'mappings',
      builds: Travis.Build,
      commits: Travis.Commit,
      jobs: Travis.Job
      service_hooks: Travis.ServiceHook

  plurals:
    repository: 'repositories',
    branch: 'branches'

  updateRecord: (store, type, record) ->
    id = get(record, record.get('primaryKey') || 'id')
    root = @rootForType(type)
    plural = @pluralize(root)
    url =  @buildURL(type.url || plural, id)
    data = root: record.toJSON()

    @ajax url, 'PUT',
      data: data
      success: (json) ->
        @sideload(store, type, json, root)
        store.didUpdateRecord(record, json && json[root])

  find: (store, type, id) ->
    root = @rootForType(type)
    plural = @pluralize(root)
    url =  @buildURL(type.url || plural, id)

    @ajax url, 'GET',
      success: (json) ->
        @sideload(store, type, json, root)
        store.load(type, json[root])
      accepts:
        json: 'application/vnd.travis-ci.2+json'

  findMany: (store, type, ids) ->
    root = @rootForType(type)
    plural = @pluralize(root)
    url =  @buildURL(type.url || plural)

    @ajax url, 'GET',
      data:
        ids: ids
      success: (json) ->
        @sideload(store, type, json, plural)
        store.loadMany(type, json[plural])
      accepts:
        json: 'application/vnd.travis-ci.2+json'

  findAll: (store, type) ->
    root = @rootForType(type)
    plural = @pluralize(root)
    url =  @buildURL(type.url || plural)

    @ajax url, 'GET',
      success: (json) ->
        @sideload(store, type, json, plural)
        store.loadMany(type, json[plural])
      accepts:
        json: 'application/vnd.travis-ci.2+json'

  findQuery: (store, type, query, recordArray) ->
    root = @rootForType(type)
    plural = @pluralize(root)
    url =  @buildURL(type.url || plural)

    @ajax url, 'GET',
      data: query,
      success: (json) ->
        @sideload(store, type, json, plural)
        recordArray.load(json[plural])
      accepts:
        json: 'application/vnd.travis-ci.2+json'

  rootForType: (type) ->
    # sorry, but this seems very weird, really
    # return type.url if (type.url)

    parts = type.toString().split('.')
    name = parts[parts.length - 1]
    name.replace(/([A-Z])/g, '_$1').toLowerCase().slice(1)

  buildURL: (record, suffix) ->
    Ember.assert('Namespace URL (' + @namespace + ') must not start with slash', !@namespace || @namespace.toString().charAt(0) != '/')
    Ember.assert('Record URL (' + record + ') must not start with slash', !record || record.toString().charAt(0) != '/')
    Ember.assert('URL suffix (' + suffix + ') must not start with slash', !suffix || suffix.toString().charAt(0) != '/')

    url = ['']
    url.push(@namespace) if (@namespace != undefined)
    url.push(record)
    url.push(suffix) if (suffix != undefined)
    url.join('/')


