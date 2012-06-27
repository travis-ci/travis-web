$.mockjaxSettings.log = false

@Travis = Em.Namespace.create
  App: Em.Application.extend
    initialize: (router) ->
      $.extend(this, Travis.Controllers)
      $.extend(this, Travis.Views)
      @store = Travis.Store.create()
      @_super(router || Travis.Router.create())

  run: ->
    @app = Travis.App.create()
    @app.initialize()


require 'ext/jquery'
require 'controllers'
require 'helpers'
require 'models'
require 'router'
require 'store'
require 'templates'
require 'views'
require 'locales'
