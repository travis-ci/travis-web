ApplicationSerializer = Travis.ApplicationSerializer

Serializer = ApplicationSerializer.extend
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

Travis.JobSerializer = Serializer
