require 'helpers'
require 'travis/ticker'

Travis.Controllers = Em.Namespace.create
  AppController:          Em.Controller.extend()

  RepositoriesController: Em.ArrayController.extend()
  RepositoryController:   Em.ObjectController.extend(Travis.Urls.Repository)
  TabsController:         Em.Controller.extend()
  BuildsController:       Em.ArrayController.extend()
  BuildController:        Em.ObjectController.extend(Travis.Urls.Commit)
  JobController:          Em.ObjectController.extend(Travis.Urls.Commit)

  SidebarController:      Em.Controller.extend()
  QueuesController:       Em.ArrayController.extend()

  SponsorsController: Em.ArrayController.extend
    page: 0

    arrangedContent: (->
      @get('shuffled').slice(@start(), @end())
    ).property('shuffled.length', 'page')

    shuffled: (->
      if content = @get('content') then $.shuffle(content) else []
    ).property('content.length')

    next: ->
      @set('page', if @isLast() then 0 else @get('page') + 1)

    pages: (->
      length = @getPath('content.length')
      if length then parseInt(length / @get('perPage') + 1) else 1
    ).property('length')

    isLast: ->
      @get('page') == @get('pages') - 1

    start: ->
      @get('page') * @get('perPage')

    end: ->
      @start() + @get('perPage')

  WorkersController: Em.ArrayController.extend
    groups: (->
      groups = {}
      for worker in @get('content').toArray()
        host = worker.get('host')
        groups[host] = Em.ArrayProxy.create(content: []) if !(host in groups)
        groups[host].pushObject(worker)
      $.values(groups)
    ).property('content.length')


