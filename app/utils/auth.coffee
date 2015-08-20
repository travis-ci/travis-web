`import config from 'travis/config/environment'`
`import Ajax from 'travis/utils/ajax'`

Auth = Ember.Object.extend
  state:        "signed-out"
  receivingEnd: "#{location.protocol}//#{location.host}"

  init: ->
    window.addEventListener('message', (e) => @receiveMessage(e))

  token: ->
    Travis.sessionStorage.getItem('travis.token')

  endpoint: (->
    config.apiEndpoint
  ).property(),

  signOut: ->
    @storage.removeItem('travis.user')
    @storage.removeItem('travis.token')
    @sessionStorage.clear()
    @set('state', 'signed-out')
    @set('user', undefined)
    if user = @get('currentUser')
      @store.unloadAll('user')
    @set('currentUser', null)
    @sendToApp('afterSignOut')
    Travis.trigger('user:signed_out')

  signIn: (data) ->
    if data
      @autoSignIn(data)
    else
      @set('state', 'signing-in')
      url = "#{@get('endpoint')}/auth/post_message?origin=#{@receivingEnd}"
      $('<iframe id="auth-frame" />').hide().appendTo('body').attr('src', url)

  autoSignIn: (data) ->
    data ||= @userDataFrom(@sessionStorage) || @userDataFrom(@storage)
    @setData(data) if data

  userDataFrom: (storage) ->
    userJSON = storage.getItem('travis.user')
    user  = JSON.parse userJSON if userJSON?
    user  = user.user if user?.user
    token = storage.getItem('travis.token')
    if user && token && @validateUser(user)
      { user: user, token: token }
    else
      # console.log('dropping user, no token') if token?
      storage.removeItem('travis.user')
      storage.removeItem('travis.token')
      null

  validateUser: (user) ->
    fieldsToValidate = ['id', 'login', 'token']
    isTravisBecome = sessionStorage.getItem('travis.become')

    unless isTravisBecome
      fieldsToValidate.push 'correct_scopes'

    if config.pro
      fieldsToValidate.push 'channels'

    fieldsToValidate.every( (field) => @validateHas(field, user) ) && (isTravisBecome || user.correct_scopes)

  validateHas: (field, user) ->
    if user[field]
      true
    else
      # console.log("discarding user data, lacks #{field}")
      false

  setData: (data) ->
    @storeData(data, @sessionStorage)
    @storeData(data, @storage) unless @userDataFrom(@storage)
    user = @loadUser(data.user)
    @set('currentUser', user)

    @set('state', 'signed-in')
    Travis.trigger('user:signed_in', data.user)
    @sendToApp('afterSignIn')

  refreshUserData: (user) ->
    unless user
      if data = @userDataFrom(@sessionStorage) || @userDataFrom(@storage)
        user = data.user

    if user
      Ajax.get("/users/#{user.id}").then (data) =>
        if data.user.correct_scopes
          userRecord = @loadUser(data.user)
          userRecord.get('permissions')
          # if user is still signed in, update saved data
          if @get('signedIn')
            data.user.token = user.token
            @storeData(data, @sessionStorage)
            @storeData(data, @storage)
            Travis.trigger('user:refreshed', data.user)
        else
          return Ember.RSVP.Promise.reject()
    else
      return Ember.RSVP.Promise.resolve()

  signedIn: (->
    @get('state') == 'signed-in'
  ).property('state')

  signedOut: (->
    @get('state') == 'signed-out'
  ).property('state')

  signingIn: (->
    @get('state') == 'signing-in'
  ).property('state')

  storeData: (data, storage) ->
    storage.setItem('travis.token', data.token) if data.token
    storage.setItem('travis.user', JSON.stringify(data.user))

  loadUser: (user) ->
    @store.push(
      data:
        type: 'user',
        id: user.id
        attributes: user
    )
    @store.recordForId('user', user.id)

  receiveMessage: (event) ->
    if event.origin == @expectedOrigin()
      if event.data == 'redirect'
        window.location = "#{@get('endpoint')}/auth/handshake?redirect_uri=#{location}"
      else if event.data.user?
        event.data.user.token = event.data.travis_token if event.data.travis_token
        @setData(event.data)

  expectedOrigin: ->
    endpoint = @get('endpoint')
    if endpoint[0] == '/' then @receivingEnd else endpoint.match(/^https?:\/\/[^\/]*/)[0]

  sendToApp: (name) ->
    # TODO: this is an ugly solution, we need to do one of 2 things:
    #       * find a way to check if we can already send an event to remove try/catch
    #       * remove afterSignIn and afterSignOut events by replacing them in a more
    #         straightforward code - we can do what's needed on a routes/controller level
    #         as a direct response to either manual sign in or autoSignIn (right now
    #         we treat both cases behave the same in terms of sent events which I think
    #         makes it more complicated than it should be).
    router = @container.lookup('router:main')
    try
      router.send(name)
    catch error
      unless error.message =~ /Can't trigger action/
        throw error

  userName: (->
    @get('currentUser.name') || @get('currentUser.login')
  ).property('currentUser.login', 'currentUser.name')

  gravatarUrl: (->
    "#{location.protocol}//www.gravatar.com/avatar/#{@get('currentUser.gravatarId')}?s=48&d=mm"
  ).property('currentUser.gravatarId')

  permissions: Ember.computed.alias('currentUser.permissions')

`export default Auth`
