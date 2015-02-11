`import Ember from 'ember'`
`import ApplicationSerializer from 'travis/serializers/application'`

Serializer = ApplicationSerializer.extend
  attrs: {
    repo:        { key: 'repository_id' }
    _config:     { key: 'config' }
    _finishedAt: { key: 'finished_at' }
    _startedAt:  { key: 'started_at' }
    _duration:   { key: 'duration' }
  }

  extractSingle: (store, primaryType, rawPayload, recordId) ->
    if commit = rawPayload.commit
      rawPayload.commits = [commit]

    @_super(store, primaryType, rawPayload, recordId)

`export default Serializer`
