@Travis.Model = DS.Model.extend
  primaryKey: 'id'
  id: DS.attr('number')

  refresh: ->
    id = @get('id')
    Travis.app.store.adapter.find(Travis.app.store, @constructor, id) if id

  update: (attrs) ->
    $.each attrs, (key, value) =>
      @set(key, value) unless key is 'id'
    this

@Travis.Model.reopenClass
  filter: (callback) ->
    Travis.app.store.filter(this, callback)

  load: (attrs) ->
    Travis.app.store.load(this, attrs)

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

