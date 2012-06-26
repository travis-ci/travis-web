require 'helpers'

Travis.Controllers =
  ApplicationController:  Em.Controller.extend()
  RepositoriesController: Em.ArrayController.extend()
  RepositoryController:   Em.ObjectController.extend(Travis.Urls.Repository)
  TabsController:         Em.Controller.extend()
  HistoryController:      Em.ArrayController.extend()
  BuildController:        Em.ObjectController.extend(Travis.Urls.Commit)
  JobController:          Em.ObjectController.extend(Travis.Urls.Commit)


