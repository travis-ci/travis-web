describe 'The repositories list', ->
  beforeEach ->
    app '/'
    waitFor repositoriesRendered

  it 'lists repositories', ->
    href = $('#repositories a.slug').attr('href')
    expect(href).toEqual '#/travis-ci/travis-core'

  it "links to the repository's last build action", ->
    href = $('#repositories a.last_build').attr('href')
    expect(href).toEqual '#/travis-ci/travis-core/builds/1'

