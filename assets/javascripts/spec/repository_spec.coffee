describe 'The repository view', ->
  beforeEach ->
    app ''
    waitFor repositoriesRendered

  it 'displays the repository header', ->
    href = $('#repository h3 a').attr('href')
    expect(href).toEqual 'http://github.com/travis-ci/travis-core'
