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

  keyForV2Relationship: (key, typeClass, method) ->
    if key == 'repo'
      'repository_id'
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
