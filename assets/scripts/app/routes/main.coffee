require 'routes/route'
require 'pusher'

TravisRoute = Travis.Route
channels = Travis.Pusher.CHANNELS

Route = TravisRoute.extend
  renderTemplate: ->
    $('body').attr('id', 'home')

    @_super.apply this, arguments

    @render 'repos',   outlet: 'left', into: 'main'

  setupController: (controller)->
    # TODO: this is redundant with repositories and recent routes
    toActivate = if @signedIn() then 'owned' else 'recent'
    @container.lookup('controller:repos').activate(toActivate)

  activate: ->
    # subscribe to pusher only if we're at a main route
    if channels
      @get('pusher').subscribeAll(channels)

Travis.MainRoute = Route
