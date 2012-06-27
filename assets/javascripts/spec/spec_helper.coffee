minispade.require 'app'

@reset = ->
  Travis.app.destroy() if Travis.app
  $('body #content').empty()

@app = (url) ->
  router = Travis.Router.create
    location: Em.NoneLocation.create()

  Travis.app = Travis.App.create()
  Travis.app.set('rootElement', '#content')
  Travis.app.initialize(router)

  router.route(url)

beforeEach ->
  reset()

