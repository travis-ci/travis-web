module "Events",
  setup: ->
    Ember.run -> Travis.advanceReadiness()
  teardown: ->
    Ember.run -> Travis.reset()

test "event containing a repository, adds repository to repos list", ->
  visit('/travis-ci/travis-core').then ->
    payload =
      repository:
        id: 10
      build:
        id: 10
        repository_id: 10

    $.mockjax
      url: '/builds/10'
      responseTime: 0
      responseText: payload

    Em.run ->
      Travis.receive 'build:started',
        build:
          id: 10
        repository:
          id: 10
          slug: 'travis-ci/travis-support'
          last_build_id: 10
          last_build_number: 10
          last_build_started_at: '2012-07-02T00:01:00Z'
          last_build_finished_at: '2012-07-02T00:02:30Z'
          last_build_state: 'passed'
          last_build_duration: 90

    wait().then ->
      listsRepo
        row: 2
        item: { slug: 'travis-ci/travis-support',  build: { number: 4, url: '/travis-ci/travis-support/builds/10', duration: '1 min 30 sec', finishedAt: 'less than a minute ago' } }


test "an event containing a created job, clears the job's log", ->
  payload =
    job:
      id: 12
      repository_id: 1
      number: '1.4'
      queue: 'build.linux'

  visit('/travis-ci/travis-core/').then ->
    Em.run ->
      logRendered()
      Travis.receive 'build:created', payload

    wait().then ->
      displaysLog []

test "an event containing a requeued job, clears the job's log", ->
  payload =
    job:
      id: 12
      repository_id: 1
      number: '1.4'
      queue: 'build.linux'

  visit('/travis-ci/travis-core').then ->
    Em.run ->
      logRendered()
      Travis.receive 'build:requeued', payload

    wait().then ->
      displaysLog []


test "an event with a build adds a build to a builds list", ->
  visit('/travis-ci/travis-core/builds').then ->
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
        message: 'commit message 3'
        commit: '1234567'
        state: 'failed'
        pull_request: false
        pull_request_number: null
        pull_request_title: null

    Em.run ->
      Travis.receive 'build:started', payload

    wait().then ->
      listsBuild
        row: 1
        item: { id: 11, slug: 'travis-ci/travis-core', number: '3', sha: '1234567', branch: 'master', message: 'commit message 3', finishedAt: 'less than a minute ago', duration: '55 sec', color: 'red' }


#test "event containing a job, adds job to jobs list", ->
#  visit('travis-ci/travis-core').then ->
#    payload =
#      job:
#        id: 12
#        repository_id: 1
#        number: '1.4'
#        queue: 'builds.linux'
#
#    $.mockjax
#      url: '/jobs/12'
#      responseTime: 0
#      responseText: payload
#
#    Em.run ->
#      Travis.receive 'job:started',
#        job:
#          id: 12
#          repository_id: 1
#          repository_slug: 'travis-ci/travis-core'
#          number: '1.4'
#          queue: 'builds.linux'
#          state: 'created'
#
#    wait().then ->
#      listsQueuedJob
#        name: 'linux'
#        row: 3
#        item: { number: '1.4', repo: 'travis-ci/travis-core' }
#
#    it 'updates only keys that are available', ->
#      Em.run ->
#        Travis.receive 'job:started',
#          job:
#            id: 1
#            build_id: 1
#
#      waits(100)
#      runs ->
#        listsJob
#          table: $('#jobs')
#          row: 1
#          item: { id: 1, number: '1.1', repo: 'travis-ci/travis-core', finishedAt: '3 minutes ago', duration: '30 sec', rvm: 'rbx' }
#
#  #describe 'an event adding a worker', ->
#  #  beforeEach ->
#  #    app ''
#  #    waitFor sidebarTabsRendered
#  #    runs ->
#  #      $('#right #tab_workers a').trigger('click')
#  #      waitFor workersRendered
#
#  #  it 'adds a worker to the workers list', ->
#  #    payload =
#  #      worker:
#  #        id: 10
#  #        host: 'worker.travis-ci.org'
#  #        name: 'ruby-3'
#  #        state: 'ready'
#
#  #    $.mockjax
#  #      url: '/workers/10'
#  #      responseTime: 0
#  #      responseText: payload
#
#  #    Em.run ->
#  #      Travis.receive 'worker:created',
#  #        worker:
#  #          id: 10
#  #          name: 'ruby-3'
#  #          host: 'worker.travis-ci.org'
#  #          state: 'ready'
#
#  #    waits(100)
#  #    runs ->
#  #      listsWorker
#  #        group: 'worker.travis-ci.org'
#  #        row: 3
#  #        item: { name: 'ruby-3', state: 'ready' }
#
#
#  #describe 'an event updating a worker', ->
#  #  beforeEach ->
#  #    app '/travis-ci/travis-core'
#  #    waitFor sidebarTabsRendered
#  #    runs ->
#  #      $('#right #tab_workers a').trigger('click')
#  #      waitFor workersRendered
#
#  #  it 'does not update repository if it\'s already in the store', ->
#  #    payload =
#  #      worker:
#  #        id: 1
#  #        host: 'worker.travis-ci.org'
#  #        name: 'ruby-2'
#  #        state: 'working'
#  #        payload:
#  #          repository:
#  #            id: 1
#  #            last_build_id: 999
#  #            last_build_number: '999'
#
#  #    Em.run ->
#  #      Travis.receive 'worker:updated', payload
#
#  #    waits(100)
#  #    runs ->
#  #      listsRepo
#  #        row: 2
#  #        item: { slug: 'travis-ci/travis-core',  build: { number: 1, url: '/travis-ci/travis-core/builds/1', duration: '30 sec', finishedAt: '3 minutes ago' } }
#
#
#
