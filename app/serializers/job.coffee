`import Ember from 'ember'`
`import V2FallbackSerializer from 'travis/serializers/v2_fallback'`

Serializer = V2FallbackSerializer.extend
  isNewSerializerAPI: true
  attrs: {
    repo:   { key: 'repository_id' }
    _config: { key: 'config' }
    _finishedAt: { key: 'finished_at' }
    _startedAt:  { key: 'started_at' }
  }

  keyForV2Relationship: (key, typeClass, method) ->
    if key == 'repo'
      'repository_id'
    else
      @_super.apply(this, arguments)

  normalize: (modelClass, resourceHash) ->
    if resourceHash.commit
      resourceHash.commit['type'] = 'commit'

    @_super(modelClass, resourceHash)

`export default Serializer`
