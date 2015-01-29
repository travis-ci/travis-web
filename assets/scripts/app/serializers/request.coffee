ApplicationSerializer = Travis.ApplicationSerializer

Serializer = ApplicationSerializer.extend
  attrs: {
    branchName: { key: 'branch' }
    tagName:    { key: 'tag' }
    repo:       { key: 'repository_id' }
  }

Travis.RequestSerializer = Serializer
