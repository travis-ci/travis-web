xdescribe 'The current build tab', ->
  describe 'on the "index" state', ->
    beforeEach ->
      app ''
      waitFor buildRendered

    it 'displays the build summary', ->
      displaysBuildSummary
        id: 1
        repo: 'travis-ci/travis-core'
        commit: '1234567'
        branch: 'master'
        compare: '0123456..1234567'
        duration: '35 sec'
        message: 'commit message 1'

    describe 'given the current build has a job matrix', ->
      it 'displays the build matrix table', ->
        displaysBuildMatrix
          headers: ['Job', 'Duration', 'Finished', 'Rvm']
          jobs: [
            { id: 1, number: '#1.1', repo: 'travis-ci/travis-core', finishedAt: /\d+ (\w+) ago/, duration: '35 sec', rvm: 'rbx' },
            { id: 2, number: '#1.2', repo: 'travis-ci/travis-core', finishedAt: '-', duration: '-', rvm: '1.9.3' }
          ]

  describe 'on the "current" state', ->
    beforeEach ->
      app '!/travis-ci/travis-core'
      waitFor repositoriesRendered
      waitFor buildRendered

    it 'displays the build summary', ->
      displaysBuildSummary
        id: 1
        repo: 'travis-ci/travis-core'
        commit: '1234567'
        branch: 'master'
        compare: '0123456..1234567'
        duration: '35 sec'
        message: 'commit message 1'

    describe 'given the current build has a job matrix', ->
      it 'displays the build matrix table', ->
        displaysBuildMatrix
          headers: ['Job', 'Duration', 'Finished', 'Rvm']
          jobs: [
            { id: 1, number: '#1.1', repo: 'travis-ci/travis-core', finishedAt: /\d+ (\w+) ago/, duration: '35 sec', rvm: 'rbx' },
            { id: 2, number: '#1.2', repo: 'travis-ci/travis-core', finishedAt: '-', duration: '-', rvm: '1.9.3' }
          ]
