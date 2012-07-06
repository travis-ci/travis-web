require 'helpers'
require 'travis/ticker'

Travis.Controllers = Em.Namespace.create
  RepositoriesController: Ember.ArrayController.extend
    # sortProperties: ['sortOrder']
    # sortAscending: false
    init: ->
      @set('content', Travis.Repository.find())

  BuildsController: Em.ArrayController.extend
    repositoryBinding: 'parent.repository'
    contentBinding: 'parent.builds'

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

require 'controllers/repository'
require 'controllers/sidebar'
require 'controllers/sponsors'
require 'controllers/workers'
