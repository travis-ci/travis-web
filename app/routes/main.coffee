#require 'pusher'
#channels = Travis.Pusher.CHANNELS

`import TravisRoute from 'travis/routes/basic'`
`import config from 'travis/config/environment'`

Route = TravisRoute.extend
  renderTemplate: ->
    $('body').attr('id', 'home')

    @_super.apply this, arguments

    @render 'repos',   outlet: 'left', into: 'main'

  setupController: (controller)->
    # TODO: this is redundant with repositories and recent routes
    @container.lookup('controller:repos').activate('owned')

  activate: ->
    # subscribe to pusher only if we're at a main route
    if !config.pro && @pusher
      @pusher.subscribeAll(['common'])

`export default Route`
