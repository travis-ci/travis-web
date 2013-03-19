describe 'router', ->
  it 'renders notFound template when URL can\t be found', ->
    app '/somehing/something/something/.../dark/side/..../something/something/something/.../complete'
    waitFor appRendered
    runs ->
      expect( $('#main').text().trim() ).toEqual('The requested page was not found.')

