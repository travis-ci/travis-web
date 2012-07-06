require 'helpers'
require 'travis/ticker'

Travis.Controllers = Em.Namespace.create
  RepositoriesController: Ember.ArrayController.extend
    contentBinding: 'layout.repositories'
    # sortProperties: ['sortOrder']
    # sortAscending: false

  RepositoryController: Em.Controller.extend
    repositoryBinding: 'layout.repository'

  TabsController: Em.Controller.extend
    repositoryBinding: 'layout.repository'
    buildBinding: 'layout.build'
    jobBinding: 'layout.job'
    tabBinding: 'layout.tab'

  BuildsController: Em.ArrayController.extend
    repositoryBinding: 'layout.repository'
    contentBinding: 'layout.builds'

  BuildController: Em.Controller.extend
    repositoryBinding: 'layout.repository'
    buildBinding: 'layout.build'

  JobController: Em.Controller.extend
    repositoryBinding: 'layout.repository'
    jobBinding: 'layout.job'

  QueuesController: Em.ArrayController.extend()
  UserController: Em.Controller.extend()
  HooksController: Em.ArrayController.extend()

  # TopController: Em.Controller.extend
  #   userBinding: 'Travis.app.currentUser'

require 'controllers/sponsors'
require 'controllers/workers'
