require 'routes/route'

TravisRoute = Travis.Route

Route = TravisRoute.extend
  renderTemplate: ->
    $('body').attr('id', 'not-found')

    @render 'not_found'

Travis.NotFoundRoute = Route
