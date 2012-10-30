@Travis.Model = DS.Model.extend
  primaryKey: 'id'
  id: DS.attr('number')

  init: ->
    @loadedAttributes = []
    @_super.apply this, arguments

  refresh: ->
    if id = @get('id')
      store = @get('store')
      store.adapter.find store, @constructor, id

  update: (attrs) ->
    $.each attrs, (key, value) =>
      @set(key, value) unless key is 'id'
    this

  isAttributeLoaded: (name) ->
    key = null
    if meta = Ember.get(this.constructor, 'attributes').get(name)
      key = meta.key(this.constructor)
    else if meta = Ember.get(this.constructor, 'associationsByName').get(name)
      key = meta.options.key || @get('namingConvention').foreignKey(name)

    if key
      @get('store').isDataLoadedFor(this.constructor, @get('clientId'), key)

  isComplete: (->
    if @get 'incomplete'
      @loadTheRest()
      false
    else
      @set 'isCompleting', false
      @get 'isLoaded'
  ).property('incomplete', 'isLoaded')

  loadTheRest: ->
    return if @get('isCompleting')
    @set 'isCompleting', true

    @refresh()

  select: ->
    @constructor.select(@get('id'))

  loadedAsIncomplete: () ->
    @set 'incomplete', true

@Travis.Model.reopenClass
  find: ->
    if arguments.length == 0
      Travis.app.store.findAll(this)
    else
      @_super.apply(this, arguments)

  filter: (callback) ->
    Travis.app.store.filter(this, callback)

  load: (attrs) ->
    Travis.app.store.load(this, attrs)

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
    Travis.app.store.adapter.pluralize(@singularName())

  isAttribute: (name) ->
    Ember.get(this, 'attributes').has(name) ||
      Ember.get(this, 'associationsByName').has(name)
