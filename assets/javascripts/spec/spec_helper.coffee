minispade.require 'app'

@reset = ->
  Travis.app.destroy() if Travis.app
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
