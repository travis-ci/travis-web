require 'routes/route'

TravisRoute = Travis.Route

Route = TravisRoute.extend
  renderTemplate: ->
    $('body').attr('id', 'stats')

    @render 'stats'


Travis.StatsRoute = Route
