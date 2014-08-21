get = Ember.get

Travis.Adapter = Ember.RESTAdapter.extend
  ajax: (url, params, method) ->
    Travis.ajax.ajax(url, method || 'get', data: params)

  findMany: (klass, records, ids) ->
    url = @buildURL(klass)

    self = this
    @ajax(url, ids: ids).then (data) ->
      self.didFindMany(klass, records, data)

  didFindMany: (klass, records, data) ->
    collectionKey = Ember.get(klass, 'collectionKey')
    dataToLoad = if collectionKey then data[collectionKey] else data

    @sideload(klass, data)
    records.load(klass, dataToLoad)
    @addToRecordArrays(records.get('content'))

  buildURL: (klass, id, record) ->
    @_super.apply(this, arguments).replace(/\.json$/, '')

  didFind: (record, id, data) ->
    @sideload(record.constructor, data)
    @_super(record, id, data)
    @addToRecordArrays(record)

  didFindAll: (klass, records, data) ->
    @sideload(klass, data)
    @_super(klass, records, data)
    @addToRecordArrays(records.get('content'))

  didFindQuery: (klass, records, params, data) ->
    @sideload(klass, data)
    @_super(klass, records, params, data)
    @addToRecordArrays(records.get('content'))

  didCreateRecord: (record, data) ->
    @sideload(record.constructor, data)
    @_super(record, data)
    @addToRecordArrays(record)

  didSaveRecord: (record, data) ->
    @sideload(record.constructor, data)
    @_super(record, data)
    @addToRecordArrays(record)

  didDeleteRecord: (record, data) ->
    @sideload(record.constructor, data)
    @_super(record, data)
    @addToRecordArrays(record)

  addToRecordArrays: (records) ->
    records = [records] unless Ember.isArray(records)
    for record in records
      record.constructor.addToRecordArrays(record)

  sideload: (klass, data) ->
    for name, records of data
      records = [records] unless Ember.isArray(records)

      # we need to skip records of type, which is loaded by adapter already
      if (type = Ember.get(Travis, 'mappings')[name]) && type != klass
        for record in records
          record = type.findFromCacheOrLoad(record)
          @addToRecordArrays(record)

  find: (record, id) ->
    url = @buildURL(record.constructor, id, record)
    self = this
    @ajax(url).then (data) ->
      self.didFind record, id, data
      record

  createRecord: (record) ->
    url = @buildURL(record.constructor, undefined, record)
    self = this
    @ajax(url, record.toJSON(), "POST").then (data) ->
      self.didCreateRecord record, data
      record

  deleteRecord: (record) ->
    primaryKey = get(record.constructor, "primaryKey")
    url = @buildURL(record.constructor, get(record, primaryKey), record)
    self = this
    @ajax(url, record.toJSON(), "DELETE").then (data) -> # TODO: Some APIs may or may not return data
      self.didDeleteRecord record, data
      return

  saveRecord: (record) ->
    primaryKey = get(record.constructor, 'primaryKey')
    url = this.buildURL(record.constructor, get(record, primaryKey), record)
    self = this

    return this.ajax(url, record.toJSON(), "PUT").then (data) ->
      self.didSaveRecord(record, data)
      return record


