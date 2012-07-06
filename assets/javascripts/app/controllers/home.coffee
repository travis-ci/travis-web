require 'controllers/base'

Travis.HomeController = Travis.Controller.extend
  name: 'home'
  bindings: []

  init: ->
    @_super('top', 'repositories', 'repository', 'sidebar')

    @connectOutlet outletName: 'left', controller: @repositoriesController, viewClass: Travis.RepositoriesView
    @connectOutlet outletName: 'main', controller: @repositoryController, viewClass: Travis.RepositoryView
    @connectOutlet outletName: 'right', controller: @sidebarController, viewClass: Travis.SidebarView

  connect: (parent) ->
    @_super(parent)
    @connectTop()

  activate: (action, params) ->
    @repositoryController.activate(action, params)
