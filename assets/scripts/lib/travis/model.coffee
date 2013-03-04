@Travis.Model = DS.Model.extend
  init: ->
    @loadedAttributes = []
    @_super.apply this, arguments

  getAttr: (key, options) ->
    @needsCompletionCheck(key)
    @_super.apply this, arguments

  getBelongsTo: (key, type, meta) ->
    @needsCompletionCheck(key)
    @_super.apply this, arguments

  getHasMany: (key, type, meta) ->
    @needsCompletionCheck(key)
    @_super.apply this, arguments

  needsCompletionCheck: (key) ->
    if key && (@constructor.isAttribute(key) || @constructor.isRelationship(key)) &&
        @get('incomplete') && !@isAttributeLoaded(key)
      @loadTheRest(key)

  update: (attrs) ->
    $.each attrs, (key, value) =>
      @set(key, value) unless key is 'id'
    this

  isAttributeLoaded: (name) ->
    @get('store').isDataLoadedFor(this.constructor, @get('clientId'), name)

  isComplete: (->
    if @get 'incomplete'
      @loadTheRest()
      false
    else
      @set 'isCompleting', false
      @get 'isLoaded'
  ).property('incomplete', 'isLoaded')

  loadTheRest: (key) ->
    # for some weird reason key comes changed to a string and for some weird reason it even is called with
    # undefined key
    return if !key || key == 'undefined'

    message = "Load missing fields for #{@constructor.toString()} because of missing key '#{key}', cid: #{@get('clientId')}, id: #{@get('id')}"
    if @constructor.isAttribute('state') && key != 'state'
      message += ", in state: #{@get('state')}"
    console.log message
    return if @get('isCompleting')
    @set 'isCompleting', true

    unless @get('stateManager.currentState.path').match /^rootState.loaded.materializing/
      @reload()
    @set 'incomplete', false

  select: ->
    @constructor.select(@get('id'))

@Travis.Model.reopenClass
  find: ->
    if arguments.length == 0
      Travis.store.findAll(this)
    else
      @_super.apply(this, arguments)

  filter: (callback) ->
    Travis.store.filter(this, callback)

  load: (attrs) ->
    Travis.store.load(this, attrs)

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
    Travis.store.adapter.pluralize(@singularName())

  isAttribute: (name) ->
    Ember.get(this, 'attributes').has(name)

  isRelationship: (name) ->
    Ember.get(this, 'relationshipsByName').has(name)

  isHasManyRelationship: (name) ->
    if relationship = Ember.get(this, 'relationshipsByName').get(name)
      relationship.kind == 'hasMany'

  isBelongsToRelationship: (name) ->
    if relationship = Ember.get(this, 'relationshipsByName').get(name)
      relationship.kind == 'belongsTo'
