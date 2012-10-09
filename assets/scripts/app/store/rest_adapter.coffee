require 'travis/ajax'
require 'models'

@Travis.RestAdapter = DS.RESTAdapter.extend
  mappings:
    repositories: Travis.Repo
    repository:   Travis.Repo
    repos:        Travis.Repo
    repo:         Travis.Repo
    builds:       Travis.Build
    build:        Travis.Build
    commits:      Travis.Commit
    commit:       Travis.Commit
    jobs:         Travis.Job
    job:          Travis.Job
    account:      Travis.Account
    accounts:     Travis.Account
    worker:       Travis.Worker
    workers:      Travis.Worker

  plurals:
    repositories: 'repositories',
    repository: 'repositories',
    repo:       'repositories',
    repos:      'repositories',
    build:      'builds'
    branch:     'branches'
    job:        'jobs'
    worker:     'workers'
    profile:    'profile'

  ajax: ->
    Travis.ajax.ajax.apply(this, arguments)
