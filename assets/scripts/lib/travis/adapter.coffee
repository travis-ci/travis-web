Travis.Adapter = Ember.RESTAdapter.extend
  ajax: (url, params, method) ->
    Travis.ajax.ajax(url, method || 'get', data: params)

  findMany: (klass, records, ids) ->
    url = @buildURL(klass) + '?' + ids.map( (id) -> "ids[]=#{id}" ).join('&')

    self = this
    @ajax(url).then (data) ->
      self.didFindMany(klass, records, data)

  didFindMany: (klass, records, data) ->
    collectionKey = Ember.get(klass, 'collectionKey')
    dataToLoad = if collectionKey then data[collectionKey] else data

    @sideload(klass, data)
    records.load(klass, dataToLoad)

  buildURL: ->
    @_super.apply(this, arguments).replace(/\.json$/, '')

  didFind: (record, id, data) ->
    @sideload(record.constructor, data)
    @_super(record, id, data)

  didFindAll: (klass, records, data) ->
    @sideload(klass, data)
    @_super(klass, records, data)

  didFindQuery: (klass, records, params, data) ->
    @sideload(klass, data)
    @_super(klass, records, params, data)

  didCreateRecord: (record, data) ->
    @sideload(record.constructor, data)
    @_super(record, data)

  didSaveRecord: (record, data) ->
    @sideload(record.constructor, data)
    @_super(record, data)

  didDeleteRecord: (record, data) ->
    @sideload(record.constructor, data)
    @_super(record, data)

  sideload: (klass, data) ->
    for name, records of data
      records = [records] unless Ember.isArray(records)

      # we need to skip records of type, which is loaded by adapter already
      if (type = Ember.get(Travis, 'mappings')[name]) && type != klass
        for record in records
          type.findFromCacheOrLoad(record)


