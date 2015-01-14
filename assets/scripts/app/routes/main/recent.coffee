require 'routes/route'
require 'routes/main_tab'

MainTabRoute = Travis.MainTabRoute

Route = MainTabRoute.extend
  reposTabName: 'recent'

Travis.MainRecentRoute = Route
