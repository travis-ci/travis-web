require 'helpers'
require 'travis/ticker'

Travis.reopen
  Controller: Em.Controller.extend
    init: ->
      for name in Array.prototype.slice.apply(arguments)
        name = "#{$.camelize(name, false)}Controller"
        klass = Travis[$.camelize(name)] || Em.Controller
        this[name] = klass.create(parent: this,  namespace: Travis, controllers: this)

    connectTop: ->
      @connectOutlet(outletName: 'top', controller: @topController, viewClass: Travis.TopView)
      @topController.set('tab', @get('name'))

  RepositoriesController: Ember.ArrayController.extend
    # sortProperties: ['sortOrder']
    # sortAscending: false

    searchBox: Ember.TextField.create()

    init: ->
      @set('content', Travis.Repository.find())
      @searchBox.appendTo('#search_box')

    recent: ->
      @set('content', Travis.Repository.find())
      # @tabs.activate('recent')

    owned_by: (githubId) ->
      @set('content', Travis.Repository.owned_by(githubId))
      # @tabs.activate('my_repositories')

    search: ->
      @set('content', Travis.Repository.search(@searchBox.value))
      # @tabs.activate('search')

    searchObserver: (->
      this[if @searchBox.value then 'search' else 'recent']()
      # @tabs.setDisplay('search', @searchBox.value)
    ).observes('searchBox.value'),

  BuildsController: Em.ArrayController.extend
    repositoryBinding: 'parent.repository'
    contentBinding: 'parent.builds'

  QueuesController: Em.ArrayController.extend()
  UserController: Em.Controller.extend()
  HooksController: Em.ArrayController.extend()

  # TopController: Em.Controller.extend
  #   userBinding: 'Travis.app.currentUser'

require 'controllers/home'
require 'controllers/profile'
require 'controllers/repository'
require 'controllers/sidebar'
require 'controllers/sponsors'
require 'controllers/stats'
require 'controllers/workers'
