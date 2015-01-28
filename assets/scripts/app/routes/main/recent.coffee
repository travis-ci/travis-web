require 'routes/route'
require 'routes/main-tab'

MainTabRoute = Travis.MainTabRoute

Route = MainTabRoute.extend
  reposTabName: 'recent'

Travis.MainRecentRoute = Route
