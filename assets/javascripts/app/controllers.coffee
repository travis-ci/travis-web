require 'helpers'

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

  WorkersController: Em.ArrayController.extend
    groups: (->
      groups = {}
      for worker in @get('content').toArray()
        host = worker.get('host')
        groups[host] = Em.ArrayProxy.create(content: []) if !(host in groups)
        groups[host].pushObject(worker)
      $.values(groups)
    ).property('content.length')


