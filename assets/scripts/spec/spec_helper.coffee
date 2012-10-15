minispade.require 'app'

@reset = ->
  Em.run ->
    if Travis.app
      if Travis.app.store
        Travis.app.store.destroy()
      Travis.app.destroy()
      delete Travis.app
      delete Travis.store

  waits(500) # TODO not sure what we need to wait for here
  $('#application').remove()
  $('body').append( $('<div id="application"></div>') )

@app = (url) ->
  reset()
  Em.run ->
    Travis.run(rootElement: $('#application'))
    waitFor -> Travis.app
    # TODO: so much waiting here, I'm sure we can minimize this
    runs ->
      url = "/#{url}" if url && !url.match(/^\//)
      Travis.app.router.route(url)
      waits 100
      runs ->
        foo = 'bar'

_Date = Date
@Date = (date) ->
  new _Date(date || '2012-07-02T00:03:00Z')
@Date.UTC = _Date.UTC
