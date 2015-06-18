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

`export default Route`
