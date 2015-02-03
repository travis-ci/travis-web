config = ENV.config

Route = Ember.Route.extend
  beforeModel: (transition) ->
    @auth.autoSignIn() unless @signedIn()

    if !@signedIn() && @get('needsAuth')
      @auth.set('afterSignInTransition', transition)
      Ember.RSVP.reject("needs-auth")
    else
      @_super.apply(this, arguments)

  signedIn: ->
    @controllerFor('currentUser').get('model')

  needsAuth: (->
    # on pro, we need to auth on every route
    config.pro
  ).property()

Travis.BasicRoute = Route
