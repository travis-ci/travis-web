require 'routes/basic'

TravisRoute = Travis.BasicRoute

Route = TravisRoute.extend
  needsAuth: true
  activate: ->
    @get('stylesheetsManager').disable('main')
    @get('stylesheetsManager').enable('dashboard')

  deactivate: ->
    @get('stylesheetsManager').enable('main')
    @get('stylesheetsManager').disable('dashboard')

Travis.DashboardRoute = Route
