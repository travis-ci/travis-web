require 'helpers'
require 'travis/ticker'

Travis.Controllers = Em.Namespace.create
  RepositoriesController: Em.ArrayController.extend()
  RepositoryController:   Em.ObjectController.extend(Travis.Urls.Repository)
  BuildsController:       Em.ArrayController.extend()
  BuildController:        Em.ObjectController.extend(Travis.Urls.Commit)
  JobController:          Em.ObjectController.extend(Travis.Urls.Commit)
  QueuesController:       Em.ArrayController.extend()
  HooksController:        Em.ArrayController.extend()

require 'controllers/sponsors'
require 'controllers/workers'
