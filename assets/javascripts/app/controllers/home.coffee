Travis.HomeController = Travis.Controller.extend
  name: 'home'

  activate: (action, params) ->
    @repositoryController.activate(action, params)
