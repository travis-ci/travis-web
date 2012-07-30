minispade.require 'app'

@reset = ->
  Em.run ->
    if Travis.app
      if Travis.app.store
        Travis.app.store.destroy()
      if views = Travis.app.get('_connectedOutletViews')
        views.forEach (v) -> v.destroy()
      Travis.app.destroy()

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
