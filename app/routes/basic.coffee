`import config from 'travis/config/environment'`
`import Ember from 'ember'`

Route = Ember.Route.extend
  activate: ->
    if @routeName != 'error'
      @controllerFor('error').set('layoutName', null)
    return @_super.apply(this, arguments)

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

`export default Route`
