@Travis.Urls =
  repository: (slug) ->
    "#!/#{slug}" if slug

  builds: (slug) ->
    "#!/#{slug}/builds" if slug

  build: (slug, id) ->
    "#!/#{slug}/builds/#{id}" if slug && id

  job: (slug, id) ->
    "#!/#{slug}/jobs/#{id}" if slug && id

  Repository:
    urlGithub: (->
      "http://github.com/#{@getPath('repository.slug')}"
    ).property('repository.slug'),

    urlGithubWatchers: (->
      "http://github.com/#{@get('slug')}/watchers"
    ).property('slug'),

    urlGithubNetwork: (->
      "http://github.com/#{@get('slug')}/network"
    ).property('slug'),

    urlGithubAdmin: (->
      "http://github.com/#{@get('slug')}/admin/hooks#travis_minibucket"
    ).property('slug')

    statusImage: (->
      "#{@get('slug')}.png"
    ).property('slug')

  Commit:
    urlGithubCommit: (->
      "http://github.com/#{@getPath('repository.slug')}/commit/#{@getPath('commit.sha')}"
    ).property('repository.slug', 'commit.sha')

    urlAuthor: (->
      "mailto:#{@getPath('commit.authorEmail')}"
    ).property('commit.authorEmail')

    urlCommitter: (->
      "mailto:#{@getPath('commit.committerEmail')}"
    ).property('commit.committerEmail')

