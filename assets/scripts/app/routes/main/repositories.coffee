require 'routes/route'
require 'routes/main-tab'

MainTabRoute = Travis.MainTabRoute

Route = MainTabRoute.extend
  needsAuth: true
  reposTabName: 'owned'
  afterModel: ->
    @controllerFor('repos').possiblyRedirectToGettingStartedPage()

Travis.MainRepositoriesRoute = Route
