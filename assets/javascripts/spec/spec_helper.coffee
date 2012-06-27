minispade.require 'app'

@reset = ->
  Travis.app.destroy() if Travis.app
  $('body #content').remove()

@app = (url) ->
  $('body').append('<div id="content"></div>')
  Travis.app = Travis.App.create(rootElement: '#content')
  Travis.app.initialize()
  Em.routes.set('location', url)

beforeEach ->
  reset()

