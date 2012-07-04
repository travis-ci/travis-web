require 'helpers'
require 'travis/ticker'

Travis.Controllers = Em.Namespace.create
  RepositoriesController: Em.ArrayController.extend()
  RepositoryController:   Em.ObjectController.extend(Travis.Urls.Repository)
  BuildsController:       Em.ArrayController.extend()
  BuildController:        Em.ObjectController.extend(Travis.Urls.Commit)
  JobController:          Em.ObjectController.extend(Travis.Urls.Commit)
  QueuesController:       Em.ArrayController.extend()
  UserController:         Em.ObjectController.extend()
  HooksController:        Em.ArrayController.extend()

  # TopController: Em.Controller.extend
  #   userBinding: 'Travis.app.currentUser'

require 'controllers/sponsors'
require 'controllers/workers'
