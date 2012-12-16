@Travis.Auth = Ember.Object.extend
  iframe: $('<iframe id="auth-frame" />').hide()
  timeout: 30000 # api has a lower timeout for opening a popup
  state: 'signed-out'
  receivingEnd: "#{location.protocol}//#{location.host}"

  init: ->
    @iframe.appendTo('body')
    window.addEventListener('message', (e) => @receiveMessage(e))

  accessToken: (->
    Travis.sessionStorage.getItem('travis.token')
  ).property()

  # if the user is in the session storage, we're using it. if we have a flag
  # for auto signin then we're trying to sign in.
  autoSignIn: (path) ->
    console.log 'autoSignIn'
    global  = Travis.storage.getItem('travis.user')
    session = Travis.sessionStorage.getItem('travis.user')
    user    = session || global
    if @validateUser(user)
      Travis.storage.setItem('travis.user', user) unless global
      data = JSON.parse(user)
      data = { user: data } unless data.user?
      @setData(data)
    else if Travis.storage.getItem('travis.auto_signin')
      console.log 'travis.auto_signin', Travis.storage.getItem('travis.auto_signin')
      Travis.storage.setItem('travis.auto_signin', false)
      @signIn()

  validateUser: (user) ->
    return false unless typeof user == 'string'
    user = JSON.parse(user)
    user.id && user.login && user.token

  # try signing in, but check later in case we have a timeout
  signIn: () ->
    console.log 'set state, signing-in'
    @set('state', 'signing-in')
    @trySignIn()
    Ember.run.later(this, @checkSignIn.bind(this), @timeout)

  signOut: ->
    Travis.storage.removeItem('travis.auto_signin')
    Travis.storage.removeItem('travis.locale')
    Travis.storage.removeItem('travis.user')
    Travis.storage.removeItem('travis.token')
    Travis.sessionStorage.clear()
    Travis.setLocale Travis.default_locale
    @setData()

  trySignIn: ->
    console.log 'trySignIn', "#{@endpoint}/auth/post_message?origin=#{@receivingEnd}"
    @iframe.attr('src', "#{@endpoint}/auth/post_message?origin=#{@receivingEnd}")

  checkSignIn: ->
    @forceSignIn() if @get('state') == 'signing-in'

  forceSignIn: ->
    console.log 'forceSignIn'
    Travis.storage.setItem('travis.auto_signin', 'true')
    window.location = "#{@endpoint}/auth/handshake?redirect_uri=#{location}"

  # TODO should have clearData() to clean this up
  setData: (data) ->
    data = JSON.parse(data) if typeof data == 'string'
    @storeToken(data?.token)
    user = @storeUser(data.user) if data?.user
    @set('state', if user then 'signed-in' else 'signed-out')
    @set('user',  if user then user else undefined)
    @afterSignIn(data.user) if data?.user

  afterSignIn: (user) ->
    Travis.setLocale user.locale || Travis.default_locale
    Travis.trigger('user:signed_in', user)
    @get('app.router').send('afterSignIn', @readAfterSignInPath())

  storeToken: (token) ->
    token = token || Travis.storage.getItem('travis.token')
    if token
      Travis.storage.setItem('travis.token', token)
      Travis.sessionStorage.setItem('travis.token', token)
      @notifyPropertyChange('accessToken')

  storeUser: (user) ->
    Travis.storage.setItem('travis.auto_signin', 'true')
    Travis.sessionStorage.setItem('travis.user', JSON.stringify(user))
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
        @forceSignIn()
      else if event.data.user?
        event.data.user.token = event.data.travis_token if event.data.travis_token
        @setData(event.data)
        console.log("signed in as #{event.data.user.login}")
    else
      console.log("unexpected message #{event.origin}: #{event.data}")

  expectedOrigin: ->
    if @endpoint[0] == '/' then @receivingEnd else @endpoint
