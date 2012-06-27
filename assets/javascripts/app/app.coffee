require 'hax0rs'

# $.mockjaxSettings.log = false

@Travis = Em.Namespace.create
  run: ->
    @app = Travis.App.create(this)
    @app.initialize()

  App: Em.Application.extend
    initialize: (router) ->
      # ember wants this dependencies setup for connectOutlet
      $.extend this, Travis.Controllers
      $.extend this, Travis.Views
      for name, controller of Travis.Controllers
        name = name.charAt(0).toLowerCase() + name.substr(1)
        this[name] = controller.create(namespace: this, controllers: this)

      @store = Travis.Store.create()
      @routes = Travis.Router.create(app: this)

      @_super(Em.Object.create())
      @routes.start()

    connectLayout: ->
      view = Travis.Views.ApplicationView.create()
      view.set('controller', @applicationController)
      view.appendTo(@get('rootElement') || 'body')

    connectLeft: (repositories) ->
      @set('repositories', repositories)
      @get('applicationController').connectOutlet(outletName: 'left', name: 'repositories', context: repositories)

    connectRepository: (repository) ->
      @set('repository', repository)
      @get('applicationController').connectOutlet(outletName: 'main', name: 'repository', context: repository)

    connectTabs: (build, job) ->
      @setPath('tabsController.repository', @get('repository'))
      @setPath('tabsController.build', build)
      @setPath('tabsController.job', job)
      @get('repositoryController').connectOutlet(outletName: 'tabs', name: 'tabs')

    connectBuilds: (builds) ->
      @get('repositoryController').connectOutlet(outletName: 'tab', name: 'history', context: builds)

    connectBuild: (build) ->
      @get('repositoryController').connectOutlet(outletName: 'tab', name: 'build', context: build)

    connectJob: (job) ->
      @get('repositoryController').connectOutlet(outletName: 'tab', name: 'job', context: job)


require 'ext/jquery'
require 'controllers'
require 'helpers'
require 'models'
require 'router'
require 'store'
require 'templates'
require 'views'
require 'locales'
