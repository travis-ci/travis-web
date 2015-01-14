require 'routes/route'

TravisRoute = Travis.Route

Route = TravisRoute.extend
  needsAuth: false

  renderTemplate: ->
    if @get('config').pro
      $('body').addClass('pro')

    @_super.apply(this, arguments)

  actions:
    redirectToGettingStarted: ->
      # do nothing, we handle it only in index path

    renderDefaultTemplate: ->
      @renderDefaultTemplate() if @renderDefaultTemplate

    error: (error) ->
      if error == 'needs-auth'
        authController = @container.lookup('controller:auth')
        authController.set('redirected', true)
        @transitionTo('auth')
      else
        return true

    renderFirstSync: ->
      @transitionTo 'first_sync'

    afterSignIn: ->
      if transition = @auth.get('afterSignInTransition')
        @auth.set('afterSignInTransition', null)
        transition.retry()
      else
        @transitionTo('main')

    afterSignOut: ->
      if @get('config').pro
        @transitionTo('auth')
      else
        @transitionTo('main')

Travis.ApplicationRoute = Route
