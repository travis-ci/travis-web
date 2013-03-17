describe 'on the "builds" state', ->
  beforeEach ->
    app '/travis-ci/travis-core/builds'
    waitFor buildsRendered

  it 'displays the expected stuff', ->
    listsRepos [
      { slug: 'travis-ci/travis-hub',    build: { number: 4, url: '/travis-ci/travis-hub/builds/4',    duration: '1 min', finishedAt: '-' } }
      { slug: 'travis-ci/travis-core',   build: { number: 1, url: '/travis-ci/travis-core/builds/1',   duration: '30 sec', finishedAt: '3 minutes ago' } }
      { slug: 'travis-ci/travis-assets', build: { number: 3, url: '/travis-ci/travis-assets/builds/3', duration: '30 sec', finishedAt: 'a day ago' } }
    ]

    displaysRepository
      href: 'http://github.com/travis-ci/travis-core'

    displaysTabs
      current: { href: '/travis-ci/travis-core' }
      builds:  { href: '/travis-ci/travis-core/builds', active: true }
      build:   { hidden: true }
      job:     { hidden: true }


    listsBuilds [
      { id: 2, slug: 'travis-ci/travis-core', number: '2', sha: '2345678', branch: 'feature', message: 'commit message 2', duration: '-', finishedAt: '-', color: '' }
      { id: 1, slug: 'travis-ci/travis-core', number: '1', sha: '1234567', branch: 'master', message: 'commit message 1', duration: '30 sec', finishedAt: '3 minutes ago', color: 'green' }
    ]
