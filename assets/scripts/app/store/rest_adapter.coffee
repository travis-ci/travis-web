require 'travis/ajax'
require 'models'

Travis.RestAdapter = DS.RESTAdapter.extend
  mappings:
    broadcasts:   Travis.Broadcast
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
    repo:       'repos',
    repos:      'repos',
    build:      'builds'
    branch:     'branches'
    job:        'jobs'
    worker:     'workers'
    profile:    'profile'

  ajax: ->
    Travis.ajax.ajax.apply(this, arguments)

  sideload: (store, type, json, root) ->
    if json && json.result
      return
    else
      @_super.apply this, arguments

Travis.RestAdapter.map 'Travis.Commit', {}
