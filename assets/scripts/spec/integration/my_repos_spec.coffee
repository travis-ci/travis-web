module "My repos",
  setup: ->
    Ember.run -> Travis.advanceReadiness()
  teardown: ->
    Ember.run -> Travis.reset()

test "my repos is active by default when user is signed in", ->
  Ember.run -> signInUser()
  visit('/').then ->
    wait().then ->
      listsRepos [
        { slug: 'travis-ci/travis-hub',    build: { number: 4, url: '/travis-ci/travis-hub/builds/4',    duration: '1 min', finishedAt: '-' } }
        { slug: 'travis-ci/travis-core',   build: { number: 1, url: '/travis-ci/travis-core/builds/1',   duration: '30 sec', finishedAt: '3 minutes ago' } }
      ]

      displaysRepository
        href: '/travis-ci/travis-hub'

      displaysSummary
        type: 'build'
        id: 4
        repo: 'travis-ci/travis-hub'
        commit: '4567890'
        branch: 'master'
        compare: '0123456..4567890'
        finishedAt: '-'
        duration: '-'
        message: 'commit message 4'

test "my repos is activated when user signs in", ->
  visit('/').then ->
    listsRepos [
      { slug: 'travis-ci/travis-hub',    build: { number: 4, url: '/travis-ci/travis-hub/builds/4',    duration: '1 min', finishedAt: '-' } }
      { slug: 'travis-ci/travis-core',   build: { number: 1, url: '/travis-ci/travis-core/builds/1',   duration: '30 sec', finishedAt: '3 minutes ago' } }
      { slug: 'travis-ci/travis-assets', build: { number: 3, url: '/travis-ci/travis-assets/builds/3', duration: '30 sec', finishedAt: 'a day ago' } }
    ]

    Ember.run -> signInUser()

    wait().then ->
      listsRepos [
        { slug: 'travis-ci/travis-hub',    build: { number: 4, url: '/travis-ci/travis-hub/builds/4',    duration: '1 min', finishedAt: '-' } }
        { slug: 'travis-ci/travis-core',   build: { number: 1, url: '/travis-ci/travis-core/builds/1',   duration: '30 sec', finishedAt: '3 minutes ago' } }
      ]
