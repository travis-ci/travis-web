Travis.RepoSerializer = Travis.ApplicationSerializer.extend
  attrs: {
    _lastBuildDuration: { key: 'last_build_duration' }
  }
