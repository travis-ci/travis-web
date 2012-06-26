minispade.require 'app'

@after = (time, func) ->
  waits(time)
  jasmine.getEnv().currentSpec.runs(func)

@once = (condition, func) ->
  waitsFor(condition)
  jasmine.getEnv().currentSpec.runs(func)

@reset = ->
  Travis.app.destroy() if Travis.app
  $('body #content').empty()

@createApp = ->
  Travis.app = Travis.App.create()
  Travis.app.set('rootElement', '#content')
  Travis.app.initialize()

@waitFor = waitsFor

@repositoriesRendered = ->
  $('#repositories li').length > 0

beforeEach ->
  reset()

