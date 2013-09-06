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

  load: (id, hash) ->
    @loadedAttributes = []
    @loadedRelationships = []

    attributes = this.attributes || []
    relationships = this.relationships || []

    for key in attributes
      dataKey = @dataKey(key)
      if hash.hasOwnProperty(dataKey)
        @loadedAttributes.pushObject(key)

    for key in relationships
      dataKey = @dataKey(key)
      if hash.hasOwnProperty(dataKey)
        @loadedRelationships.pushObject(key)

    incomplete = Ember.EnumerableUtils.intersection(@loadedAttributes, attributes).length != attributes.length ||
                 Ember.EnumerableUtils.intersection(@loadedRelationships, relationships).length != relationships.length

    #if incomplete
    #  properties = attributes.concat(relationships)
    #  loadedProperties = @loadedAttributes.concat(@loadedRelationships)
    #  diff = properties.diff(loadedProperties)
    #  #console.log(@constructor, 'with id', id, 'loaded as incomplete, info:', { diff: diff, attributes: loadedProperties, data: hash})

    @set('incomplete', incomplete)

    @_super(id, hash)

  getAttr: (key, options) ->
    @needsCompletionCheck(key)
    @_super.apply this, arguments

  getBelongsTo: (key, type, meta) ->
    unless key
      key = type.singularName() + '_id'
    @needsCompletionCheck(key)
    @_super(key, type, meta)

  getHasMany: (key, type, meta) ->
    unless key
      key = type.singularName() + '_ids'
    @needsCompletionCheck(key)
    @_super(key, type, meta)

  needsCompletionCheck: (key) ->
    if key && (@isAttribute(key) || @isRelationship(key)) &&
        @get('incomplete') && !@isPropertyLoaded(key)
      @loadTheRest(key)

  isAttribute: (name) ->
    this.constructor.getAttributes().contains(name)

  isRelationship: (name) ->
    this.constructor.getRelationships().contains(name)

  loadTheRest: (key) ->
    # for some weird reason key comes changed to a string and for some weird reason it even is called with
    # undefined key
    return if !key || key == 'undefined'

    message = "Load missing fields for #{@constructor.toString()} because of missing key '#{key}', cid: #{@get('clientId')}, id: #{@get('id')}"
    if @isAttribute('state') && key != 'state'
      message += ", in state: #{@get('state')}"
    console.log message
    return if @get('isCompleting')
    @set 'isCompleting', true

    @reload()

  select: ->
    @constructor.select(@get('id'))

  isPropertyLoaded: (name) ->
    @loadedAttributes.contains(name) || @loadedRelationships.contains(name)

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
    !!@_getOrCreateReferenceForId(id).record

  camelizeKeys: true

  # TODO: the functions below will be added to Ember Model, remove them when that
  # happens
  resetData: ->
    @_idToReference = null
    @sideloadedData = null
    @recordCache = null
    @recordArrays = null
    @_currentBatchIds = null
    @_hasManyArrays = null
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
    record = @create({ _reference: reference })
    @recordCache = {} unless @recordCache
    @sideloadedData = {} unless @sideloadedData
    @recordCache[reference.id] = record
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
