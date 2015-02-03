require 'routes/basic'

TravisRoute = Travis.BasicRoute

Route = TravisRoute.extend
  needsAuth: true

  setupController: (controller, model) ->
    @controllerFor('accounts').set('model', model)

  renderTemplate: ->
    $('body').attr('id', 'profile')
    @_super.apply(this, arguments)
    @render 'loading', outlet: 'left', into: 'profile'

Travis.ProfileRoute = Route
