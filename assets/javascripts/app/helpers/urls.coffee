@Travis.Urls =
  repository: (slug) ->
    "#!/#{slug}"

  builds: (slug) ->
    "#!/#{slug}/builds"

  build: (slug, id) ->
    "#!/#{slug}/builds/#{id}"

  job: (slug, id) ->
    "#!/#{slug}/jobs/#{id}"

  githubCommit: (slug, sha) ->
    "http://github.com/#{slug}/commit/#{sha}"

  githubRepository: (slug) ->
    "http://github.com/#{slug}"

  githubWatchers: (slug) ->
    "http://github.com/#{slug}/watchers"

  githubNetwork: (slug) ->
    "http://github.com/#{slug}/network"

  email: (email) ->
    "mailto:#{email}"
