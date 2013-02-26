require 'store/rest_adapter'

coerceId = (id) -> if id == null then null else id+''

Travis.Store = DS.Store.extend
  revision: 11
  adapter: Travis.RestAdapter.create()

  init: ->
    @_super.apply this, arguments
    @_loadedData = {}
    @clientIdToComplete = {}

  load: (type, data, prematerialized) ->
    result = @_super.apply this, arguments

    if result && result.clientId && @clientIdToComplete[result.clientId] == undefined
      # I assume that everything that goes through load is complete record
      # representation, incomplete hashes from pusher go through merge()
      @clientIdToComplete[result.clientId] = true

    result

  # TODO use isUpdating once we've upgraded ember-data
  loadMany: (type, ids, hashes) ->
    result = @_super.apply this, arguments
    array.set('isLoaded', true) for array in @typeMapFor(type).recordArrays
    result

  merge: (type, data, incomplete) ->
    id = coerceId data.id

    typeMap   = @typeMapFor(type)
    clientId  = typeMap.idToCid[id]
    record    = @recordCache[clientId]
    if record
      @get('adapter').merge(this, record, data)
    else
      if (savedData = @clientIdToData[clientId]) && savedData.id?
        $.extend(savedData, data)
      else
        result = @load(type, data, {id: data.id})

        if result && result.clientId
          clientId = result.clientId
          if incomplete
            @clientIdToComplete[result.clientId] = false

    { clientId: clientId, id: id }

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
      data = data.job
      job  = @find(Travis.Job, data.id)
      job.appendLog(number: parseInt(data.number), content: data._log)
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

    result = @loadIncomplete(type, json[root])
    if result.id
      @find(type, result.id)

  addLoadedData: (type, clientId, hash) ->
    id = hash.id
    @_loadedData[type.toString()] ||= {}
    loadedData = (@_loadedData[type][clientId] ||= [])

    serializer = @get('adapter.serializer')

    Ember.get(type, 'attributes').forEach( (name, meta) ->
      value = @extractAttribute(type, hash, name)
      if value != undefined
        loadedData.pushObject name unless loadedData.contains(name)
    , serializer)

    Ember.get(type, 'relationshipsByName').forEach( (name, relationship) ->
      key   = @_keyForBelongsTo(type, relationship.key)
      value = @extractBelongsTo(type, hash, key)
      if value != undefined
        loadedData.pushObject name unless loadedData.contains(name)
    , serializer)

  isDataLoadedFor: (type, clientId, key) ->
    if recordsData = @_loadedData[type.toString()]
      if data = recordsData[clientId]
        data.contains(key)

  loadIncomplete: (type, hash, options) ->
    options ?= {}

    id = coerceId hash.id

    typeMap     = @typeMapFor(type)
    cidToData   = @clientIdToData
    clientId    = typeMap.idToCid[id]

    if clientId && cidToData[clientId] && options.skipIfExists
      return

    result = @merge(type, hash, true)
    if result && result.clientId
      @addLoadedData(type, result.clientId, hash)
    # TODO: it will be probably needed to uncomment and fix this
    #@_updateAssociations(type, type.singularName(), hash)

    result

  materializeRecord: (type, clientId, id) ->
    record = @_super.apply this, arguments

    if @clientIdToComplete[clientId] != undefined && !@clientIdToComplete[clientId]
      record.set 'incomplete', true
    else
      record.set 'incomplete', false

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
