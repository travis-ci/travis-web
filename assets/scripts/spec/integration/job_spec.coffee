module "Job page",
  setup: ->
    Ember.run -> Travis.advanceReadiness()
  teardown: ->
    Ember.run -> Travis.reset()


test 'displaying information on job page', ->
  $.mockjax
    url: '/jobs/1/log?cors_hax=true'
    responseTime: 0
    responseText: "First line\ncontent:travis_fold:start:install\r$ Install something\nInstalling something\ncontent:travis_fold:end:install\r$ End"

  visit('travis-ci/travis-core/jobs/1').then ->
    listsRepos [
      { slug: 'travis-ci/travis-hub',    build: { number: 4, url: '/travis-ci/travis-hub/builds/4',    duration: '1 min', finishedAt: '-' } }
      { slug: 'travis-ci/travis-core',   build: { number: 1, url: '/travis-ci/travis-core/builds/1',   duration: '30 sec', finishedAt: '3 minutes ago' } }
      { slug: 'travis-ci/travis-assets', build: { number: 3, url: '/travis-ci/travis-assets/builds/3', duration: '30 sec', finishedAt: 'a day ago' } }
    ]

    displaysRepository
      href: '/travis-ci/travis-core'

    displaysSummary
      id: 1
      type: 'job'
      repo: 'travis-ci/travis-core'
      commit: '1234567'
      branch: 'master'
      compare: '0123456..1234567'
      finishedAt: '3 minutes ago'
      duration: '30 sec'
      message: 'commit message 1'

    displaysTabs
      current: { href: '/travis-ci/travis-core' }
      builds:  { href: '/travis-ci/travis-core/builds' }
      build:   { href: '/travis-ci/travis-core/builds/1' }
      job:     { href: '/travis-ci/travis-core/jobs/1', active: true }

    displaysLog [
      'First line',
      '$ Install something',
      'Installing something',
      '$ End'
    ]

#  it 'allows to expand folds', ->
#    waits 100
#    runs ->
#      expect($('#fold-start-install').hasClass('open')).toBeFalsy()
#      $('#fold-start-install').click()
#      waits 20
#      runs ->
#        expect($('#fold-start-install').hasClass('open')).toBeTruthy()
#
#
#describe 'too long log', ->
#  beforeEach ->
#    $.mockjax
#      url: '/jobs/2/log?cors_hax=true'
#      responseTime: 0
#      responseText: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10'
#
#    Log.LIMIT = 5
#
#    app 'travis-ci/travis-core/jobs/2'
#    waitFor logRendered
#
#  afterEach ->
#    Log.LIMIT = 10000
#
#  it 'is cut after given limit', ->
#    displaysLog [
#      '12345'
#    ]
#
#    expect( $('#log-container .warning').text() ).toMatch /This log is too long to be displayed/
#    expect( $('#log-container .warning a').attr('href') ).toEqual '/jobs/2/log.txt?deansi=true'
#
#
