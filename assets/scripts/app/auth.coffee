@Travis.Auth = Ember.Object.extend
  state:        "signed-out"
  receivingEnd: "#{location.protocol}//#{location.host}"

  init: ->
    window.addEventListener('message', (e) => @receiveMessage(e))

  signOut: ->
    Travis.storage.removeItem('travis.locale')
    Travis.storage.removeItem('travis.user')
    Travis.storage.removeItem('travis.token')
    Travis.sessionStorage.clear()
    Travis.setLocale Travis.default_locale
    @set('state', 'signed-out')
    @set('user', undefined)

  signIn: ->
    @set('state', 'signing-in')
    url = "#{@endpoint}/auth/post_message?origin=#{@receivingEnd}"
    $('<iframe id="auth-frame" />').hide().appendTo('body').attr('src', url)

  autoSignIn: ->
    data = @userDataFrom(Travis.sessionStorage) || @userDataFrom(Travis.storage)
    @setData(data) if data

  userDataFrom: (storage) ->
    user  = JSON.parse storage.getItem('travis.user')
    user  = user.user if user?.user
    token = storage.getItem('travis.token')
    if user && token && @validateUser(user)
      { user: user, token: token }
    else
      storage.removeItem('travis.user')
      storage.removeItem('travis.token')
      null

  validateUser: (user) ->
    @validateHas('id', user) && @validateHas('login', user) && @validateHas('token', user)

  validateHas: (field, user) ->
    if user.field?
      true
    else
      console.log("discarding user data, lacks #{field}")
      false

  setData: (data) ->
    @storeData(data, Travis.sessionStorage)
    @storeData(data, Travis.storage) unless @userDataFrom(Travis.storage)
    @set('user', @loadUser(data.user))
    @set('state', 'signed-in')
    Travis.setLocale(data.user.locale || Travis.default_locale)
    Travis.trigger('user:signed_in', data.user)
    @get('app.router').send('afterSignIn', @readAfterSignInPath())

  storeData: (data, storage) ->
    storage.setItem('travis.token', data.token)
    storage.setItem('travis.user', JSON.stringify(data.user))

  loadUser: (user) ->
    @app.store.load(Travis.User, user)
    user = @app.store.find(Travis.User, user.id)
    user.get('permissions')
    user

  storeAfterSignInPath: (path) ->
    Travis.sessionStorage.setItem('travis.after_signin_path', path)

  readAfterSignInPath: ->
    path = Travis.sessionStorage.getItem('travis.after_signin_path')
    Travis.sessionStorage.removeItem('travis.after_signin_path')
    path

  receiveMessage: (event) ->
    if event.origin == @expectedOrigin()
      if event.data == 'redirect'
        window.location = "#{@endpoint}/auth/handshake?redirect_uri=#{location}"
      else if event.data.user?
        event.data.user.token = event.data.travis_token if event.data.travis_token
        @setData(event.data)

  expectedOrigin: ->
    if @endpoint[0] == '/' then @receivingEnd else @endpoint
