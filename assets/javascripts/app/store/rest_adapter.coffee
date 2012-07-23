require 'models'

jQuery.support.cors = true

@Travis.RestAdapter = DS.RESTAdapter.extend
  DEFAULT_OPTIONS:
    accepts:
      json: 'application/vnd.travis-ci.2+json'

  mappings:
    repositories: Travis.Repository
    repository:   Travis.Repository
    builds:       Travis.Build
    build:        Travis.Build
    commits:      Travis.Commit
    commit:       Travis.Commit
    jobs:         Travis.Job
    job:          Travis.Job
    worker:       Travis.Worker
    workers:      Travis.Worker

  plurals:
    repository: 'repositories',
    build: 'builds'
    branch: 'branches'
    job: 'jobs'
    worker: 'workers'

  ajax: (url, method, options) ->
    @_super("#{Travis.config.api_endpoint}#{url}", method, $.extend(options, @DEFAULT_OPTIONS))
