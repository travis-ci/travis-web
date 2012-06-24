Travis.ApplicationController  = Em.Controller.extend()
Travis.RepositoriesController = Em.ArrayController.extend()
Travis.RepositoryController   = Em.ObjectController.extend(Travis.Urls.Repository)
Travis.TabsController         = Em.Controller.extend()
Travis.HistoryController      = Em.ArrayController.extend()
Travis.BuildController        = Em.ObjectController.extend(Travis.Urls.Commit)
Travis.JobController          = Em.ObjectController.extend(Travis.Urls.Commit)


