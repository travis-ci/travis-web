require 'travis/ajax'
require 'models'

@Travis.RestAdapter = DS.RESTAdapter.extend Travis.Ajax,
  mappings:
    repositories: Travis.Repository
    repository:   Travis.Repository
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
    repository: 'repositories',
    build: 'builds'
    branch: 'branches'
    job: 'jobs'
    worker: 'workers'
    profile: 'profile'
