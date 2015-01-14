require 'routes/route'

TravisRoute = Travis.Route

Route = TravisRoute.extend
  needsAuth: false

  renderTemplate: ->
    $('body').attr('id', 'auth')

    @render 'auth.signin'

  deactivate: ->
    @controllerFor('auth').set('redirected', false)

  actions:
    afterSignIn: ->
      @transitionTo('index')
      return true

  redirect: ->
    if @signedIn()
      @transitionTo('index')

Travis.AuthRoute = Route
