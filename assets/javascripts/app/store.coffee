require 'store/rest_adapter'

Travis.Store = DS.Store.extend
  revision: 4
  adapter: Travis.RestAdapter.create()

  loadData: (event, data) ->
    mappings = @adapter.get('mappings')
    name = event.split(':').shift()

    if type = mappings[name]
      @_loadMany(this, type, data)
    else if type = mappings[@adapter.pluralize(name)]
      @_loadOne(this, type, data)
    else
      throw "can't find type for #{name}" unless type

  _loadOne: (store, type, json) ->
    root = type.singularName()
    @adapter.sideload(store, type, json, root)
    type.load(json[root])
    @_updateAssociations(type, json[root])

  # _loadMany: (store, type, json) ->
  #   root = type.pluralName()
  #   @adapter.sideload(store, type, json, root)
  #   @loadMany(type, json[root])

  _updateAssociations: (type, data) ->
    Em.get(type, 'associationsByName').forEach (key, meta) =>
      if meta.kind == 'belongsTo' && id = data["#{key}_id"]
        parent = type.find(data.id).getPath("#{key}.data")
        ids = parent.get("#{root}_ids")
        parent.set("#{root}_ids", ids.concat(data.id)) if ids && !(data.id in ids)

