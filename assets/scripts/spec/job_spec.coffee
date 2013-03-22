describe 'on the "job" state', ->
  beforeEach ->
    $.mockjax
      url: '/jobs/1/log?cors_hax=true'
      responseTime: 0
      responseText: 'log 1'


    app 'travis-ci/travis-core/jobs/1'
    waitFor jobRendered
    runs ->
      waitFor hasText('#tab_build', 'Build #1')

  it 'displays the expected stuff', ->
    listsRepos [
      { slug: 'travis-ci/travis-hub',    build: { number: 4, url: '/travis-ci/travis-hub/builds/4',    duration: '1 min', finishedAt: '-' } }
      { slug: 'travis-ci/travis-core',   build: { number: 1, url: '/travis-ci/travis-core/builds/1',   duration: '30 sec', finishedAt: '3 minutes ago' } }
      { slug: 'travis-ci/travis-assets', build: { number: 3, url: '/travis-ci/travis-assets/builds/3', duration: '30 sec', finishedAt: 'a day ago' } }
    ]

    waits 100
    runs ->
      displaysRepository
        href: 'http://github.com/travis-ci/travis-core'

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
        'log 1'
      ]

describe 'too long log', ->
  beforeEach ->
    $.mockjax
      url: '/jobs/2/log?cors_hax=true'
      responseTime: 0
      responseText: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10'

    Travis.OrderedLog.reopen
      linesLimit: 5

    app 'travis-ci/travis-core/jobs/2'
    waitFor logRendered

  afterEach ->
    Travis.OrderedLog.reopen
      linesLimit: 5000

  it 'is cut after given limit', ->
    displaysLog [
      '12345'
    ]

    expect( $('#log .cut').text() ).toEqual 'Log was too long to display. Download the the raw version to get the full log.'
    expect( $('#log .cut a').attr('href') ).toEqual '/jobs/2/log.txt?deansi=true'


