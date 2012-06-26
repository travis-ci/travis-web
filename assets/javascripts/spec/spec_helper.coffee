minispade.require 'app'

beforeEach ->
  $('body #content').empty()
  Em.run ->
    Travis.app = Travis.App.create()
    Travis.app.set('rootElement', '#content')
    Travis.app.initialize()

afterEach ->
  Travis.app.destroy()

