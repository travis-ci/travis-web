get = Ember.get
set = Ember.set

Array.prototype.diff = (a) ->
  this.filter (i) -> !(a.indexOf(i) > -1)


@Travis.Model = Ember.Model.extend
  id: Ember.attr('number')

  init: ->
    @_super.apply this, arguments
    this

  merge: (hash) ->
    data = @get('_data')
    Ember.merge(data, hash)
    @notifyPropertyChange('_data')

  unload: ->
    @constructor.unload(this)

  dataKey: (key) ->
    meta = @constructor.metaForProperty(key)
    if meta.isRelationship && !meta.options?.key?
      type = meta.type
      if typeof type == "string"
        type = Ember.get(Ember.lookup, type)

      if meta.kind == 'belongsTo'
        return type.singularName() + '_id'
      else
        return type.singularName() + '_ids'

    @_super(key)

  getBelongsTo: (key, type, meta) ->
    unless key
      key = type.singularName() + '_id'
    @_super(key, type, meta)

  getHasMany: (key, type, meta) ->
    unless key
      key = type.singularName() + '_ids'
    @_super(key, type, meta)

  select: ->
    @constructor.select(@get('id'))

@Travis.Model.reopenClass
  select: (id) ->
    @find().forEach (record) ->
      record.set('selected', record.get('id') == id)

  buildURL: (suffix) ->
    base = @url || @pluralName()
    Ember.assert('Base URL (' + base + ') must not start with slash', !base || base.toString().charAt(0) != '/')
    Ember.assert('URL suffix (' + suffix + ') must not start with slash', !suffix || suffix.toString().charAt(0) != '/')
    url = [base]
    url.push(suffix) if (suffix != undefined)
    url.join('/')

  singularName: ->
    parts = @toString().split('.')
    name = parts[parts.length - 1]
    name.replace(/([A-Z])/g, '_$1').toLowerCase().slice(1)

  pluralName: ->
    @singularName() + 's'

  collectionKey: (->
    @pluralName()
  ).property()

  rootKey: (->
    @singularName()
  ).property()

  isModel: (->
    true
  ).property()

  isRecordLoaded: (id) ->
    reference = @_getReferenceById(id)
    reference && reference.record

  camelizeKeys: true

  # TODO: the functions below will be added to Ember Model, remove them when that
  # happens
  resetData: ->
    @_referenceCache = {}
    @sideloadedData = {}
    @recordArrays = []
    @_currentBatchIds = []
    @_hasManyArrays = []
    @_findAllRecordArray = null

  unload: (record) ->
    @removeFromRecordArrays(record)
    primaryKey = record.get(get(this, 'primaryKey'))
    @removeFromCache(primaryKey)

  removeFromCache: (key) ->
    if @sideloadedData && @sideloadedData[key]
      delete this.sideloadedData[key]
    if @recordCache && @recordCache[key]
      delete this.recordCache[key]

  loadRecordForReference: (reference) ->
    record = @create({ _reference: reference, id: reference.id })
    @sideloadedData = {} unless @sideloadedData
    reference.record = record
    record.load(reference.id, @sideloadedData[reference.id])
    # TODO: find a nicer way to not add record to record arrays twice
    if @currentRecordsToAdd
      @currentRecordsToAdd.pushObject(record) unless @currentRecordsToAdd.contains(record)
    else
      @currentRecordsToAdd = [record]

    Ember.run.scheduleOnce('data', this, @_batchAddToRecordArrays);

  _batchAddToRecordArrays: ->
    for record in @currentRecordsToAdd
      if !@_findAllRecordArray || !@_findAllRecordArray.contains(record)
        @addToRecordArrays(record)

    @currentRecordsToAdd = null
