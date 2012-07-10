minispade.require 'app'

@reset = ->
  Em.run ->
    Travis.app.destroy() if Travis.app
  waits(500) # TODO not sure what we need to wait for here
  $('#content').remove()
  $('body').append('<div id="content"></div>')

@app = (url) ->
  reset()
  Em.run ->
    Travis.run(rootElement: $('#content'))
    Em.routes.set('location', url)

_Date = Date
@Date = (date) ->
  new _Date(date || '2012-07-02T00:03:00Z')
@Date.UTC = _Date.UTC
