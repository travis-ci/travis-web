ApplicationSerializer = Travis.ApplicationSerializer

Serializer = ApplicationSerializer.extend
  attrs: {
    repo: { key: 'repository_id' }
  }

Travis.EnvVarSerializer = Serializer
