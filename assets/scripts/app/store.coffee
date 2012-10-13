require 'store/rest_adapter'

DATA_PROXY =
  get: (name) ->
    @savedData[name]

Travis.Store = DS.Store.extend
  revision: 4
  adapter: Travis.RestAdapter.create()

  load: (type, id, hash) ->
    result = @_super.apply this, arguments

    if result && result.clientId
      # I assume that everything that goes through load is complete record
      # representation, incomplete hashes from pusher go through merge()
      record = @findByClientId type, result.clientId
      record.set 'incomplete', false
      record.set 'complete', true
      # setting both incomplete and complete may be weird, but it's easier to
      # work with both values. I need to check if record has already been completed
      # and in order to do that, without having 'complete', I would need to check
      # for incomplete == false, which looks worse

    result

  merge: (type, id, hash) ->
    if hash == undefined
      hash = id
      primaryKey = type.proto().primaryKey
      Ember.assert("A data hash was loaded for a record of type " + type.toString() + " but no primary key '" + primaryKey + "' was provided.", hash[primaryKey])
      id = hash[primaryKey]

    typeMap     = @typeMapFor(type)
    dataCache   = typeMap.cidToHash
    clientId    = typeMap.idToCid[id]
    recordCache = @get('recordCache')

    if clientId != undefined
      if data = dataCache[clientId]
        $.extend(data, hash)
      else
        dataCache[clientId] = hash

      if record = recordCache[clientId]
        record.send('didChangeData')
    else
      clientId = @pushHash(hash, id, type)

    if clientId
      DATA_PROXY.savedData = hash
      @updateRecordArrays(type, clientId, DATA_PROXY)

      { id: id, clientId: clientId }

  receive: (event, data) ->
    [name, type] = event.split(':')

    mappings = @adapter.get('mappings')
    type = mappings[name]

    if event == 'job:log'
      if job = @find(Travis.Job, data['job']['id'])
        job.appendLog(data['job']['_log'])
    else if data[type.singularName()]
      @_loadOne(this, type, data)
    else if data[type.pluralName()]
      @_loadMany(this, type, data)
    else
      throw "can't load data for #{name}" unless type

  _loadOne: (store, type, json) ->
    root = type.singularName()
    # we get other types of records only on build, it comes with repository
    # attached. I don't want to use store.sideload here as it will not use merge,
    # if we need sideload becasue we have side records with other events it needs to
    # be revised
    if type == Travis.Build && json.repository
      result = @_loadIncomplete(Travis.Repo, 'repository', json.repository)
    @_loadIncomplete(type, root, json[root])

  _loadIncomplete: (type, root, hash) ->
    result = @merge(type, hash)

    if result && result.clientId
      record = @findByClientId(type, result.clientId)
      unless record.get('complete')
        record.set 'incomplete', true

      @_updateAssociations(type, root, hash)

  _loadMany: (store, type, json) ->
    root = type.pluralName()
    @adapter.sideload(store, type, json, root)
    @loadMany(type, json[root])

  _updateAssociations: (type, name, data) ->
    Em.get(type, 'associationsByName').forEach (key, meta) =>
      if meta.kind == 'belongsTo'
        id = data["#{key}_id"]
        if clientId = @typeMapFor(meta.type).idToCid[id]
          if parent = this.findByClientId(meta.type, clientId, id)
            dataProxy = parent.get('data')
            if ids = dataProxy.get("#{name}_ids")
              ids.pushObject(data.id) unless data.id in ids
              parent.send('didChangeData');
