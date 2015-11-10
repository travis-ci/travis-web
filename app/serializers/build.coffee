`import Ember from 'ember'`
`import V2FallbackSerializer from 'travis/serializers/v2_fallback'`

Serializer = V2FallbackSerializer.extend
  isNewSerializerAPI: true
  attrs: {
    _config:     { key: 'config' }
    _finishedAt: { key: 'finished_at' }
    _startedAt:  { key: 'started_at' }
    _duration:   { key: 'duration' }
  }

  extractRelationships: (modelClass, resourceHash) ->
    result = @_super(modelClass, resourceHash)
    result

  normalizeArrayResponse: (store, primaryModelClass, payload, id, requestType) ->
    if payload.commits
      payload.builds.forEach (build) ->
        commit_id = build.commit_id
        if commit = payload.commits.findBy('id', commit_id)
          build.commit = commit
          delete build.commit_id

    result = @_super.apply(this, arguments)
    store = this.store
    # TODO: probably it should be done for all of the relationships, not
    # only commit
    result.data.forEach (item) ->
      if item.relationships && item.relationships.commit
        serializer = store.serializerFor 'commit'
        modelClass = store.modelFor 'commit'
        normalized = serializer.normalize(modelClass, item.relationships.commit.data)
        result.included.push normalized.data

    result

  keyForV2Relationship: (key, typeClass, method) ->
    if key == 'repo'
      'repository_id'
    else if key == 'commit'
      key
    else
      @_super.apply(this, arguments)

   normalize: (modelClass, resourceHash) ->
    result = @_super(modelClass, resourceHash)

    data = result.data

    # for some reasone repo's promise not always has its id set
    # so we can't always do build.get('repo.id')
    # this ensures that repositoryId is always reachable on build
    # TODO: look into the real cause of the problem (maybe it will be gone
    #       after fully switching to V3 and/or updating ember-data)
    if repoId = resourceHash.repository_id
      data.attributes.repositoryId = repoId
    else if resourceHash.repository
      if href = resourceHash.repository['@href']
        id = href.match(/\d+/)[0]
        data.attributes.repositoryId = id

    return result

`export default Serializer`
