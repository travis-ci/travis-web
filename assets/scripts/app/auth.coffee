@Travis.Auth = Ember.Object.extend
  state:        "signed-out"
  receivingEnd: "#{location.protocol}//#{location.host}"

  init: ->
    window.addEventListener('message', (e) => @receiveMessage(e))

  signOut: ->
    Travis.storage.removeItem('travis.user')
    Travis.storage.removeItem('travis.token')
    Travis.sessionStorage.clear()
    @set('state', 'signed-out')
    @set('user', undefined)
    if user = Travis.__container__.lookup('controller:currentUser').get('content')
      user.unload()
    Travis.__container__.lookup('controller:currentUser').set('content', null)
    if router = Travis.__container__.lookup('router:main')
      try
        router.send('afterSignOut')
      catch e
        throw e unless e.message =~ /There are no active handlers/


  signIn: (data) ->
    if data
      @autoSignIn(data)
    else
      @set('state', 'signing-in')
      url = "#{@endpoint}/auth/post_message?origin=#{@receivingEnd}"
      $('<iframe id="auth-frame" />').hide().appendTo('body').attr('src', url)

  autoSignIn: (data) ->
    data ||= @userDataFrom(Travis.sessionStorage) || @userDataFrom(Travis.storage)
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
    @validateHas('id', user) && @validateHas('login', user) && @validateHas('token', user) && @validateHas('correct_scopes', user) && user.correct_scopes

  validateHas: (field, user) ->
    if user[field]
      true
    else
      # console.log("discarding user data, lacks #{field}")
      false

  setData: (data) ->
    @storeData(data, Travis.sessionStorage)
    @storeData(data, Travis.storage) unless @userDataFrom(Travis.storage)
    user = @loadUser(data.user)
    # TODO: we should not use __container__ directly, how to do it better?
    #        A good answer seems to do auth in context of controller.
    Travis.__container__.lookup('controller:currentUser').set('content', user)

    @set('state', 'signed-in')
    Travis.trigger('user:signed_in', data.user)
    if router = Travis.__container__.lookup('router:main')
      Ember.run.next =>
        try
          router.send('afterSignIn')
        catch e
          throw e unless e =~ /There are no active handlers/ || e =~ /Can't trigger action "afterSignIn/
        @refreshUserData(data.user)

  refreshUserData: (user) ->
    Travis.ajax.get "/users/#{user.id}", (data) =>
      Travis.loadOrMerge(Travis.User, data.user)
      # if user is still signed in, update saved data
      if @signedIn()
        data.user.token = user.token
        @storeData(data, Travis.sessionStorage)
        @storeData(data, Travis.storage)

  signedIn: ->
    @get('state') == 'signed-in'

  storeData: (data, storage) ->
    storage.setItem('travis.token', data.token) if data.token
    storage.setItem('travis.user', JSON.stringify(data.user))

  loadUser: (user) ->
    Travis.loadOrMerge(Travis.User, user)
    user = Travis.User.find(user.id)
    user.get('permissions')
    user

  receiveMessage: (event) ->
    if event.origin == @expectedOrigin()
      if event.data == 'redirect'
        window.location = "#{@endpoint}/auth/handshake?redirect_uri=#{location}"
      else if event.data.user?
        event.data.user.token = event.data.travis_token if event.data.travis_token
        @setData(event.data)

  expectedOrigin: ->
    if @endpoint[0] == '/' then @receivingEnd else @endpoint
