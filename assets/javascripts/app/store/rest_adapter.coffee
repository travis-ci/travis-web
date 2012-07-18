require 'models'

@Travis.RestAdapter = DS.RESTAdapter.extend
  API_DOMAIN: 'http://localhost:9292'

  DEFAULT_OPTIONS:
    accepts:
      json: 'application/vnd.travis-ci.2+json'

  mappings:
    repositories: Travis.Repository
    builds: Travis.Build
    commits: Travis.Commit
    jobs: Travis.Job

  plurals:
    repository: 'repositories',
    build: 'builds'
    branch: 'branches'
    job: 'jobs'
    worker: 'workers'

  ajax: (url, method, options) ->
    @_super("#{@API_DOMAIN}#{url}", method, $.extend(options, @DEFAULT_OPTIONS))
