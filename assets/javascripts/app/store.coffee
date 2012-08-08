require 'store/rest_adapter'

DATA_PROXY =
  get: (name) ->
    @savedData[name]

Travis.Store = DS.Store.extend
  revision: 4
  adapter: Travis.RestAdapter.create()

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
    @adapter.sideload(store, type, json, root)
    @merge(type, json[root])
    @_updateAssociations(type, root, json[root])

  _loadMany: (store, type, json) ->
    console.log('loadMany')
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
