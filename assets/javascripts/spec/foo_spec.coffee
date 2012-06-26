describe 'Foo', ->
  beforeEach ->
    createApp()
    waitFor repositoriesRendered

  it 'bar', ->
    href = $('#repositories a.slug').attr('href')
    expect(href).toEqual '#/travis-ci/travis-core'

  it 'bar', ->
    href = $('#repositories a.slug').attr('href')
    expect(href).toEqual '#/travis-ci/travis-core'

