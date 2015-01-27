Travis.RequestSerializer = Travis.ApplicationSerializer.extend
  attrs: {
    branchName: { key: 'branch' }
    tagName:    { key: 'tag' }
    repo:       { key: 'repository_id' }
  }
