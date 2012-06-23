@Travis.Urls =
  Repository:
    urlGithub: (->
      'http://github.com/%@'.fmt @get('slug')
    ).property('slug'),

    urlGithubWatchers: (->
      'http://github.com/%@/watchers'.fmt @get('slug')
    ).property('slug'),

    urlGithubNetwork: (->
      'http://github.com/%@/network'.fmt @get('slug')
    ).property('slug'),

    urlGithubAdmin: (->
      'http://github.com/%@/admin/hooks#travis_minibucket'.fmt @get('slug')
    ).property('slug')

    statusImage: (->
      '%@.png'.fmt @get('slug')
    ).property('slug')

  Commit:
    urlAuthor: (->
      'mailto:%@'.fmt @getPath('commit.authorEmail')
    ).property('commit')

    urlCommitter: (->
      'mailto:%@'.fmt @getPath('commit.committerEmail')
    ).property('commit')

  Build:
    githubCommit: (->
      'http://github.com/%@/commit/%@'.fmt @getPath('repository.slug'), @getPath('commit.sha')
    ).property('repository.slug', 'commit.sha')

