`import Ember from 'ember'`

Auth = Ember.Object.extend
  state: 'signed-out'

  # I want to disable auto sign in for tests for now, the plan is to either
  # explicitly say that you're signed in or out (the latter being the default)
  autoSignIn: (->)

  signOutForTests: ->
    @set('state', 'signed-out')
    @set('currentUser', null)

  signInForTests: (user) ->
    @set('state', 'signed-in')
    if user.constructor.typeKey? != 'user'
      @store.push(
        data:
          type: 'user',
          id: user.id
          attributes: user
      )
      user = @store.recordForId('user', user.id)

    @set('currentUser', user)

  # TODO: we use these properties in templates, but there
  #       really should be something like a 'session' service that can be
  #       injected where we need it
  userName: (->
    @get('currentUser.name') || @get('currentUser.login')
  ).property('currentUser.login', 'currentUser.name')

  gravatarUrl: (->
    "#{location.protocol}//www.gravatar.com/avatar/#{@get('currentUser.gravatarId')}?s=48&d=mm"
  ).property('currentUser.gravatarId')

  permissions: Ember.computed.alias('currentUser.permissions')

  signedIn: (->
    @get('state') == 'signed-in'
  ).property('state')

  signedOut: (->
    @get('state') == 'signed-out'
  ).property('state')

  signingIn: (->
    @get('state') == 'signing-in'
  ).property('state')

  token: ->
    if @get('state') == 'signed-in'
      'a-token'

  refreshUserData: ->
    return Ember.RSVP.Promise.resolve()

`export default Auth`
