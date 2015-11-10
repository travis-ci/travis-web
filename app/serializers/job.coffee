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

  extractSingle: (store, primaryType, rawPayload, recordId) ->
    if commit = rawPayload.commit
      rawPayload.commits = [commit]

    @_super(store, primaryType, rawPayload, recordId)

  keyForV2Relationship: (key, typeClass, method) ->
    if key == 'repo'
      'repository_id'
    else
      @_super.apply(this, arguments)

`export default Serializer`
