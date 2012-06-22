Travis.ApplicationController  = Em.Controller.extend()
Travis.RepositoriesController = Em.ArrayController.extend()
Travis.RepositoryController   = Em.ObjectController.extend(Travis.Urls.Repository)
Travis.TabsController         = Em.Controller.extend()
Travis.HistoryController      = Em.ArrayController.extend()
Travis.JobController          = Em.ObjectController.extend()
Travis.LoadingController      = Em.Controller.extend()

Travis.CurrentController = Travis.BuildController = Em.ObjectController.extend
  classes: (->
    Travis.Helpers.colorForResult(@getPath('content.result'))
  ).property('content.result')


