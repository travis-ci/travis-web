describe 'my repos tab', ->
  describe 'when user is signed in', ->
    beforeEach ->
      app '/', user: true
      waitFor myReposRendered, 'my repositories'
      runs ->
        waitFor buildRendered, 'build view'

    it 'is active', ->
      listsRepos [
        { slug: 'travis-ci/travis-core',   build: { number: 1, url: '/travis-ci/travis-core/builds/1',   duration: '30 sec', finishedAt: '3 minutes ago' } }
        { slug: 'travis-ci/travis-hub',    build: { number: 4, url: '/travis-ci/travis-hub/builds/4',    duration: '1 min', finishedAt: '-' } }
      ]

      displaysRepository
        href: 'http://github.com/travis-ci/travis-core'

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

  describe 'when user is not signed in', ->
    beforeEach ->
      app '/'
      waitFor reposRendered, 'repositories list'
      runs ->
        waitFor buildRendered, 'build view'

    it 'is activated when user signs in', ->
      listsRepos [
        { slug: 'travis-ci/travis-hub',    build: { number: 4, url: '/travis-ci/travis-hub/builds/4',    duration: '1 min', finishedAt: '-' } }
        { slug: 'travis-ci/travis-core',   build: { number: 1, url: '/travis-ci/travis-core/builds/1',   duration: '30 sec', finishedAt: '3 minutes ago' } }
        { slug: 'travis-ci/travis-assets', build: { number: 3, url: '/travis-ci/travis-assets/builds/3', duration: '30 sec', finishedAt: 'a day ago' } }
      ]

      signInUser()

      waitFor myReposRendered, 'my repositories'
      runs ->
        waitFor buildRendered, 'build view'
        runs ->
          listsRepos [
            { slug: 'travis-ci/travis-core',   build: { number: 1, url: '/travis-ci/travis-core/builds/1',   duration: '30 sec', finishedAt: '3 minutes ago' } }
            { slug: 'travis-ci/travis-hub',    build: { number: 4, url: '/travis-ci/travis-hub/builds/4',    duration: '1 min', finishedAt: '-' } }
          ]
