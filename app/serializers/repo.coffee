ApplicationSerializer = Travis.ApplicationSerializer

Serializer = ApplicationSerializer.extend
  attrs: {
    _lastBuildDuration: { key: 'last_build_duration' }
  }

Travis.RepoSerializer = Serializer
