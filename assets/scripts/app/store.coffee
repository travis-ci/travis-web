require 'store/rest_adapter'

DATA_PROXY =
  get: (name) ->
    @savedData[name]

Travis.Store = DS.Store.extend
  revision: 4
  adapter: Travis.RestAdapter.create()

  init: ->
    @_super.apply this, arguments
    @_loadedData = {}

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

  # TODO use isUpdating once we've upgraded ember-data
  loadMany: (type, ids, hashes) ->
    result = @_super.apply this, arguments
    array.set('isLoaded', true) for array in @typeMapFor(type).recordArrays
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
      if (data = dataCache[clientId]) && (typeof data == 'object')
        for key, value of hash
          if ( descriptor = Object.getOwnPropertyDescriptor(data, key) ) && descriptor.set
            Ember.set(data, key, value)
          else
            data[key] = value
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

  isInStore: (type, id) ->
    !!@typeMapFor(type).idToCid[id]

  receive: (event, data) ->
    [name, type] = event.split(':')

    mappings = @adapter.get('mappings')
    type = mappings[name]

    if event == 'build:started' && data.build.commit
      # TODO: commit should be a sideload record on build, not mixed with it
      build = data.build
      commit = {
        id:              build.commit_id
        author_email:    build.author_email
        author_name:     build.author_name
        branch:          build.branch
        committed_at:    build.committed_at
        committer_email: build.committer_email
        committer_name:  build.committer_name
        compare_url:     build.compare_url
        message:         build.message
        sha:             build.commit
      }
      delete(data.build.commit)
      @loadIncomplete(Travis.Commit, commit)


    if event == 'job:log'
      if job = @find(Travis.Job, data['job']['id'])
        console.log 'job:log', data
        job.appendLog(number: data['job']['number'], content: data['job']['_log'])
    else if data[type.singularName()]
      @_loadOne(this, type, data)
    else if data[type.pluralName()]
      @_loadMany(this, type, data)
    else
      throw "can't load data for #{name}" unless type

  _loadOne: (store, type, json) ->
    root = type.singularName()
    # we get other types of records only in a few situations and
    # it's not always needed to update data, so I'm specyfing which
    # things I want to update here:
    if type == Travis.Build && (json.repository || json.repo)
      @loadIncomplete(Travis.Repo, json.repository || json.repo)

    @loadIncomplete(type, json[root])

  addLoadedData: (type, clientId, hash) ->
    id = hash.id
    @_loadedData[type.toString()] ||= {}
    loadedData = (@_loadedData[type][clientId] ||= [])
    for key of hash
      loadedData.pushObject key unless loadedData.contains(key)

  isDataLoadedFor: (type, clientId, key) ->
    if recordsData = @_loadedData[type.toString()]
      if data = recordsData[clientId]
        data.contains(key)

  loadIncomplete: (type, hash, options) ->
    options ?= {}

    id = hash.id

    typeMap     = @typeMapFor(type)
    dataCache   = typeMap.cidToHash
    clientId    = typeMap.idToCid[id]

    if dataCache[clientId] && options.skipIfExists
      return

    result = @merge(type, hash)

    if result && result.clientId
      @addLoadedData(type, result.clientId, hash)
      record = @findByClientId(type, result.clientId)
      unless record.get('complete')
        record.loadedAsIncomplete()

      @_updateAssociations(type, type.singularName(), hash)

      record

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
