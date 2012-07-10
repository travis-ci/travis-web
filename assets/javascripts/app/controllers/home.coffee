Travis.HomeController = Travis.Controller.extend
  name: 'home'
  bindings: []

  init: ->
    @_super('top', 'repositories', 'repository', 'sidebar')

    @connectTop()
    @connectOutlet outletName: 'left', controller: @repositoriesController, viewClass: Travis.RepositoriesView
    @connectOutlet outletName: 'main', controller: @repositoryController, viewClass: Travis.RepositoryView
    @connectOutlet outletName: 'right', controller: @sidebarController, viewClass: Travis.SidebarView

  activate: (action, params) ->
    @repositoryController.activate(action, params)
