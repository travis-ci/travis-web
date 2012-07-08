# describe 'on the "job" state', ->
#   beforeEach ->
#     app '!/travis-ci/travis-core/jobs/1'
#     waitFor jobRendered
#     waitFor hasText('#tab_build', 'Build #1')
#
#   it 'displays the expected stuff', ->
#     listsRepos [
#       { slug: 'travis-ci/travis-core',   build: { number: 1, url: '#!/travis-ci/travis-core/builds/1',   duration: '30 sec', finishedAt: '3 minutes ago' } }
#       { slug: 'travis-ci/travis-assets', build: { number: 3, url: '#!/travis-ci/travis-assets/builds/3', duration: '30 sec', finishedAt: 'a day ago' } }
#       { slug: 'travis-ci/travis-hub',    build: { number: 4, url: '#!/travis-ci/travis-hub/builds/4',    duration: '1 min', finishedAt: '-' } }
#     ]
#
#     displaysRepository
#       href: 'http://github.com/travis-ci/travis-core'
#
#     displaysSummary
#       id: 1
#       type: 'job'
#       repo: 'travis-ci/travis-core'
#       commit: '1234567'
#       branch: 'master'
#       compare: '0123456..1234567'
#       finishedAt: '3 minutes ago'
#       duration: '30 sec'
#       message: 'commit message 1'
#
#     displaysTabs
#       current: { href: '#!/travis-ci/travis-core' }
#       builds:  { href: '#!/travis-ci/travis-core/builds' }
#       build:   { href: '#!/travis-ci/travis-core/builds/1' }
#       job:     { href: '#!/travis-ci/travis-core/jobs/1', active: true }
#
#     displaysLog [
#       'log 1'
#     ]
