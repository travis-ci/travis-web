require 'routes/basic'

TravisRoute = Travis.BasicRoute

Route = TravisRoute.extend
  renderTemplate: ->
    $('body').attr('id', 'not-found')

    @render 'not_found'

Travis.NotFoundRoute = Route
