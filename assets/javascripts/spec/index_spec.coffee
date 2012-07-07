describe 'on the "index" state', ->
  beforeEach ->
    app ''
    waitFor buildRendered

  it 'displays the expected stuff', ->
    displaysRepoList [
      { slug: 'travis-ci/travis-core',   build: { number: 1, url: '#!/travis-ci/travis-core/builds/1',   duration: '30 sec', finishedAt: '3 minutes ago' } }
      { slug: 'travis-ci/travis-assets', build: { number: 3, url: '#!/travis-ci/travis-assets/builds/3', duration: '30 sec', finishedAt: 'a day ago' } }
      { slug: 'travis-ci/travis-hub',    build: { number: 4, url: '#!/travis-ci/travis-hub/builds/4',    duration: '1 min', finishedAt: '-' } }
    ]

    displaysRepository
      href: 'http://github.com/travis-ci/travis-core'

    displaysBuildSummary
      id: 1
      repo: 'travis-ci/travis-core'
      commit: '1234567'
      branch: 'master'
      compare: '0123456..1234567'
      finishedAt: '3 minutes ago'
      duration: '30 sec'
      message: 'commit message 1'

    displaysTabs
      current: '#!/travis-ci/travis-core'
      builds:  '#!/travis-ci/travis-core/builds'

    displaysJobMatrix
      element: '#jobs'
      headers: ['Job', 'Duration', 'Finished', 'Rvm']
      jobs: [
        { id: 1, number: '1.1', repo: 'travis-ci/travis-core', finishedAt: '3 minutes ago', duration: '30 sec', rvm: 'rbx' }
      ]

    displaysJobMatrix
      element: '#allowed_failure_jobs'
      headers: ['Job', 'Duration', 'Finished', 'Rvm']
      jobs: [
        { id: 2, number: '1.2', repo: 'travis-ci/travis-core', finishedAt: '-', duration: '-', rvm: '1.9.3' }
      ]


