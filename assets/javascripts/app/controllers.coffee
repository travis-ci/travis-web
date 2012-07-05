require 'helpers'
require 'travis/ticker'

Travis.Controllers = Em.Namespace.create
  RepositoriesController: Em.ArrayController.extend
    contentBinding: 'layout.repositories'

  RepositoryController: Em.Controller.extend # Travis.Urls.Repository,
    repositoryBinding: 'layout.repository'

  TabsController: Em.Controller.extend
    repositoryBinding: 'layout.repository'
    buildBinding: 'layout.build'
    jobBinding: 'layout.job'
    tabBinding: 'layout.tab'

  BuildsController: Em.ArrayController.extend
    contentBinding: 'layout.builds'

  BuildController: Em.Controller.extend # Travis.Urls.Commit,
    buildBinding: 'layout.build'

  JobController: Em.Controller.extend # Travis.Urls.Commit,
    jobBinding: 'layout.job'

  QueuesController:       Em.ArrayController.extend()
  UserController:         Em.ObjectController.extend()
  HooksController:        Em.ArrayController.extend()

  # TopController: Em.Controller.extend
  #   userBinding: 'Travis.app.currentUser'

require 'controllers/sponsors'
require 'controllers/workers'
