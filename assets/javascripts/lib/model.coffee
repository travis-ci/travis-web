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
  load: (attrs) ->
    Travis.app.store.load(this, attrs)

