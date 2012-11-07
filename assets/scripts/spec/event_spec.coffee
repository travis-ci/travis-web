describe 'events', ->
  afterEach ->
    window.history.pushState({}, null, '/spec.html')

  describe 'an event adding a repository', ->
    beforeEach ->
      app 'travis-ci/travis-core'
      waitFor jobsRendered

    it 'adds a repository to the list', ->
      waitFor reposRendered

      runs ->
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
          Travis.app.receive 'build:started',
            build:
              id: 10
            repository:
              id: 10
              slug: 'travis-ci/travis-support'
              last_build_id: 10
              last_build_number: 10
              last_build_started_at: '2012-07-02T00:01:00Z'
              last_build_finished_at: '2012-07-02T00:02:30Z'

        waits(100)
        runs ->
          listsRepo
            row: 2
            item: { slug: 'travis-ci/travis-support',  build: { number: 4, url: '/travis-ci/travis-support/builds/10', duration: '1 min 30 sec', finishedAt: 'less than a minute ago' } }

  describe 'an event adding a build', ->
    beforeEach ->
      app 'travis-ci/travis-core/builds'
      waitFor buildsRendered

    it 'adds a build to the builds list', ->
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
          commit: '1234567'
          state: 'started'

      Em.run ->
        Travis.app.receive 'build:started', payload

      waits(100)
      runs ->
        listsBuild
          row: 1
          item: { id: 11, slug: 'travis-ci/travis-core', number: '3', sha: '1234567', branch: 'master', message: 'commit message 3', finishedAt: 'less than a minute ago', duration: '55 sec', color: 'red' }

  describe 'an event adding a job', ->
    beforeEach ->
      app 'travis-ci/travis-core'
      waitFor jobsRendered
      runs ->
        waitFor queuesRendered

    it 'adds a job to the jobs matrix', ->
      payload =
        job:
          id: 15
          repository_id: 1
          build_id: 1
          commit_id: 1
          log_id: 1
          number: '1.4'
          duration: 55
          started_at: '2012-07-02T00:02:00Z'
          finished_at: '2012-07-02T00:02:55Z'
          config: { rvm: 'jruby' }

      $.mockjax
        url: '/jobs/15'
        responseTime: 0
        responseText: payload

      Em.run ->
        Travis.app.receive 'job:started',
          job:
            id: 15
            repository_id: 1
            build_id: 1
            commit_id: 1

      waits(100)
      runs ->
        listsJob
          table: $('#jobs')
          row: 3
          item: { id: 15, number: '1.4', repo: 'travis-ci/travis-core', finishedAt: 'less than a minute ago', duration: '55 sec', rvm: 'jruby' }

    it 'adds a job to the jobs queue', ->
      payload =
        job:
          id: 12
          repository_id: 1
          number: '1.4'
          queue: 'builds.common'

      $.mockjax
        url: '/jobs/12'
        responseTime: 0
        responseText: payload

      Em.run ->
        Travis.app.receive 'job:started',
          job:
            id: 12
            repository_id: 1
            number: '1.4'
            queue: 'builds.common'
            state: 'created'

      waits(100)
      runs ->
        listsQueuedJob
          name: 'common'
          row: 3
          item: { number: '1.4', repo: 'travis-ci/travis-core' }

    it 'updates only keys that are available', ->
      Em.run ->
        Travis.app.receive 'job:started',
          job:
            id: 1
            build_id: 1

      waits(100)
      runs ->
        listsJob
          table: $('#jobs')
          row: 1
          item: { id: 1, number: '1.1', repo: 'travis-ci/travis-core', finishedAt: '3 minutes ago', duration: '30 sec', rvm: 'rbx' }

  describe 'an event adding a worker', ->
    beforeEach ->
      app ''
      waitFor workersRendered

    it 'adds a worker to the workers list', ->
      payload =
        worker:
          id: 10
          host: 'worker.travis-ci.org'
          name: 'ruby-3'
          state: 'ready'

      $.mockjax
        url: '/workers/10'
        responseTime: 0
        responseText: payload

      Em.run ->
        Travis.app.receive 'worker:created',
          worker:
            id: 10
            name: 'ruby-3'
            host: 'worker.travis-ci.org'
            state: 'ready'

      waits(100)
      runs ->
        listsWorker
          group: 'worker.travis-ci.org'
          row: 3
          item: { name: 'ruby-3', state: 'ready' }


  describe 'an event updating a worker', ->
    beforeEach ->
      app '/travis-ci/travis-core'
      waitFor workersRendered

    it 'does not update repository if it\'s already in store', ->
      payload =
        worker:
          id: 1
          host: 'worker.travis-ci.org'
          name: 'ruby-2'
          state: 'working'
          payload:
            repository:
              id: 1
              last_build_id: 999
              last_build_number: '999'

      Em.run ->
        Travis.app.receive 'worker:updated', payload

      waits(100)
      runs ->
        listsRepo
          row: 2
          item: { slug: 'travis-ci/travis-core',  build: { number: 1, url: '/travis-ci/travis-core/builds/1', duration: '30 sec', finishedAt: '3 minutes ago' } }



