module "Build page",
  setup: ->
    Ember.run -> Travis.advanceReadiness()
  teardown: ->
    Ember.run -> Travis.reset()

test "displaying information on build page", ->
  visit('/travis-ci/travis-core/builds')
  visit('/travis-ci/travis-core/builds/1')
  andThen(->
    listsRepos [
      { slug: 'travis-ci/travis-hub',    build: { number: 4, url: '/travis-ci/travis-hub/builds/4',    duration: '1 min', finishedAt: '-' } }
      { slug: 'travis-ci/travis-core',   build: { number: 1, url: '/travis-ci/travis-core/builds/1',   duration: '30 sec', finishedAt: '3 minutes ago' } }
      { slug: 'travis-ci/travis-assets', build: { number: 3, url: '/travis-ci/travis-assets/builds/3', duration: '30 sec', finishedAt: 'a day ago' } }
    ]

    displaysRepository
      href: '/travis-ci/travis-core'

    displaysSummary
      type: 'build'
      id: 1
      repo: 'travis-ci/travis-core'
      commit: '1234567'
      branch: 'master'
      compare: '0123456..1234567'
      finishedAt: '3 minutes ago'
      duration: '30 sec'
      message: 'commit message 1'

    displaysSummaryGravatars
      authorEmail: 'author@email.com'
      committerEmail: 'committer@email.com'


    displaysTabs
      current: { href: '/travis-ci/travis-core' }
      builds:  { href: '/travis-ci/travis-core/builds' }
      build:   { href: '/travis-ci/travis-core/builds/1', active: true }
      job:     { hidden: true }

    listsJobs
      table: '#jobs'
      headers: ['Job', 'Duration', 'Finished', 'Ruby']
      jobs: [
        { color: 'green', id: 1, number: '1.1', repo: 'travis-ci/travis-core', finishedAt: '3 minutes ago', duration: '30 sec', rvm: 'rbx' }
        { color: 'red',   id: 2, number: '1.2', repo: 'travis-ci/travis-core', finishedAt: '2 minutes ago', duration: '40 sec', rvm: '1.9.3' }
      ]

    listsJobs
      table: '#allowed_failure_jobs'
      headers: ['Job', 'Duration', 'Finished', 'Ruby']
      jobs: [
        { color: '', id: 3, number: '1.3', repo: 'travis-ci/travis-core', finishedAt: '-', duration: '-', rvm: 'jruby' }
      ]
  )


test "updating current build", ->
  visit('/travis-ci/travis-core').then ->
    payload =
      build:
        id: 11
        repository_id: 1
        commit_id: 1
        number: '3'
        duration: 55
        started_at: '2012-07-02T00:02:00Z'
        finished_at: '2012-07-02T00:02:55Z'
        event_type: 'push'
        result: 1
        message: 'commit message 3'
        commit: 'foo1234'
        branch: 'master'
        state: 'started'
        config: {}
        pull_request: false
        compare_url: 'https://github.com/compare/0123456..1234567'
      repository:
        id: 1
        last_build_number: '3'
        last_build_id: 11

    Em.run ->
      Travis.receive 'build:started', payload

    wait().then ->
      displaysSummaryBuildLink '/travis-ci/travis-core/builds/11', '3'

      displaysSummary
        type: 'build'
        id: 11
        repo: 'travis-ci/travis-core'
        commit: 'foo1234'
        branch: 'master'
        compare: '0123456..1234567'
        finishedAt: 'less than a minute ago'
        duration: '55 sec'
        message: 'commit message 3'
