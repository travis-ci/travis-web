# describe 'The tabs view', ->
#   describe 'on the "index" state', ->
#     beforeEach ->
#       app '/'
#       waitFor repositoriesRendered
#
#     it 'has a "current" tab linking to the current build', ->
#       href = $('#main .tabs a.current').attr('href')
#       expect(href).toEqual '/travis-ci/travis-core'
#
#     it 'has a "history" tab linking to the builds list', ->
#       href = $('#main .tabs a.history').attr('href')
#       expect(href).toEqual '/travis-ci/travis-core/builds'
#
#   describe 'on the "current" state', ->
#     app '/travis-ci/travis-core'
#     waitFor repositoriesRendered
#
#     it 'has a "current" tab linking to the current build', ->
#       href = $('#main .tabs a.current').attr('href')
#       expect(href).toEqual '/travis-ci/travis-core'
#
#
