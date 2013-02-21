require 'travis/ajax'
require 'models'

DS.JSONTransforms['object'] = {
  deserialize: (serialized) -> serialized
  serialize: (deserialized) -> deserialized
}

Travis.Serializer = DS.RESTSerializer.extend
  merge: (record, serialized) ->
    data = record.get('data')

    # TODO: write test that ensures that we go to materializingData
    #       only if we can
    state = record.get('stateManager.currentState.path')
    unless state == "rootState.loaded.materializing"
      record.send('materializingData')

    record.eachAttribute( (name, attribute) ->
      value = @extractAttribute(record.constructor, serialized, name)
      if value != undefined
        value = @deserializeValue(value, attribute.type)
        if value != data.attributes[name]
          record.materializeAttribute(name, value)
          record.notifyPropertyChange(name)
    , this)

    record.eachRelationship( (name, relationship) ->
      if relationship.kind == 'belongsTo'
        key = @_keyForBelongsTo(record.constructor, relationship.key)
        value = @extractBelongsTo(record.constructor, serialized, key)

        if value != undefined && data.belongsTo[name] != value
          record.materializeBelongsTo name, value
          record.notifyPropertyChange(name)
      else if relationship.kind == 'hasMany'
        key = @_keyForHasMany(record.constructor, relationship.key)
        value = @extractHasMany(record.constructor, serialized, key)

        if value != undefined
          record.materializeHasMany name, value
          record.notifyPropertyChange(name)
    , this)

    # TODO: add test that ensures that this line is called
    #       it should check if record goes into loaded.saved
    #       state after being in materializing
    record.notifyPropertyChange('data')

Travis.RestAdapter = DS.RESTAdapter.extend
  serializer: Travis.Serializer
  mappings:
    broadcasts:   Travis.Broadcast
    repositories: Travis.Repo
    repository:   Travis.Repo
    repos:        Travis.Repo
    repo:         Travis.Repo
    builds:       Travis.Build
    build:        Travis.Build
    commits:      Travis.Commit
    commit:       Travis.Commit
    jobs:         Travis.Job
    job:          Travis.Job
    account:      Travis.Account
    accounts:     Travis.Account
    worker:       Travis.Worker
    workers:      Travis.Worker

  plurals:
    repositories: 'repositories',
    repository: 'repositories',
    repo:       'repos',
    repos:      'repos',
    build:      'builds'
    branch:     'branches'
    job:        'jobs'
    worker:     'workers'
    profile:    'profile'

  ajax: ->
    Travis.ajax.ajax.apply(this, arguments)

  sideload: (store, type, json, root) ->
    if json && json.result
      return
    else
      @_super.apply this, arguments

  merge: (store, record, serialized) ->
    @get('serializer').merge(record, serialized)

Travis.RestAdapter.map 'Travis.Commit', {}

Travis.RestAdapter.map 'Travis.Build', {
  repoId: { key: 'repository_id' }
  repo:   { key: 'repository_id' }
  _duration: { key: 'duration' }
  jobs: { key: 'job_ids' }
  _config: { key: 'config' }
}

Travis.RestAdapter.map 'Travis.Repo', {
  _lastBuildDuration: { key: 'last_build_duration' }
}

Travis.RestAdapter.map 'Travis.Job', {
  repoId: { key: 'repository_id' }
  repo:   { key: 'repository_id' }
}

Travis.RestAdapter.map 'Travis.User', {
  _name: { key: 'name' }
}

Travis.RestAdapter.map 'Travis.Sponsor', {
  _image: { key: 'image' }
}
