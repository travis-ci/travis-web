@Travis.Urls =
  repository: (repository) ->
    "#!/#{repository.get('slug')}" if repository

  lastBuild: (repository) ->
    "#!/#{repository.get('slug')}/builds/#{repository.get('lastBuildId')}" if repository

  builds: (repository) ->
    "#!/#{repository.get('slug')}/builds" if repository

  build: (repository, build) ->
    "#!/#{repository.get('slug')}/builds/#{build.get('id')}" if repository && build

  job: (repository, job) ->
    "#!/#{repository.get('slug')}/jobs/#{job.get('id')}" if repository && job

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

