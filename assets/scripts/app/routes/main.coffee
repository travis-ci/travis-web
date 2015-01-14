require 'routes/route'

TravisRoute = Travis.Route

Route = TravisRoute.extend
  renderTemplate: ->
    $('body').attr('id', 'home')

    @_super.apply this, arguments

    @render 'repos',   outlet: 'left', into: 'main'

  setupController: (controller)->
    # TODO: this is redundant with repositories and recent routes
    toActivate = if @signedIn() then 'owned' else 'recent'
    @container.lookup('controller:repos').activate(toActivate)


Travis.MainRoute = Route
