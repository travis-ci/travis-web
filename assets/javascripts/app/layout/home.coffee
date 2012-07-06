require 'layout/base'

Travis.Layout.Home = Travis.Layout.Base.extend
  name: 'home'
  bindings: []

  init: ->
    @_super('repositories', 'repository', 'sidebar')

    @controller.connectOutlet(outletName: 'left', name: 'repositories')
    @controller.connectOutlet(outletName: 'main', name: 'repository')
    @controller.connectOutlet(outletName: 'right', name: 'sidebar')

  activate: (action, params) ->
    @repositoryController.activate(action, params)
