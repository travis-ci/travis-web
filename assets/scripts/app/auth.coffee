@Travis.Auth = Ember.Object.extend
  iframe: $('<iframe id="auth-frame" />').hide()
  timeout: 30000 # api has a lower timeout for opening a popup
  state: 'signed-out'
  receivingEnd: "#{location.protocol}//#{location.host}"

  init: ->
    @iframe.appendTo('body')
    window.addEventListener('message', (e) => @receiveMessage(e))

  accessToken: (->
    sessionStorage.getItem('travis.token')
  ).property()

  # if the user is in the session storage, we're using it. if we have a flag
  # for auto signin then we're trying to sign in.
  autoSignIn: (path) ->
    console.log 'autoSignIn'
    global  = localStorage.getItem('travis.user')
    session = sessionStorage.getItem('travis.user')
    user    = session || global
    if user && localStorage.getItem('travis.token')
      localStorage.setItem('travis.user', user) unless global
      data = JSON.parse(user)
      data = { user: data } unless data.user?
      @setData(data)
    else if localStorage.getItem('travis.auto_signin')
      console.log 'travis.auto_signin', localStorage.getItem('travis.auto_signin')
      @signIn()

  # try signing in, but check later in case we have a timeout
  signIn: () ->
    console.log 'set state, signing-in'
    @set('state', 'signing-in')
    @trySignIn()
    Ember.run.later(this, @checkSignIn.bind(this), @timeout)

  signOut: ->
    localStorage.removeItem('travis.auto_signin')
    localStorage.removeItem('travis.locale')
    localStorage.removeItem('travis.user')
    localStorage.removeItem('travis.token')
    sessionStorage.clear()
    @setData()

  trySignIn: ->
    console.log 'trySignIn', "#{@endpoint}/auth/post_message?origin=#{@receivingEnd}"
    @iframe.attr('src', "#{@endpoint}/auth/post_message?origin=#{@receivingEnd}")

  checkSignIn: ->
    @forceSignIn() if @get('state') == 'signing-in'

  forceSignIn: ->
    console.log 'forceSignIn'
    localStorage.setItem('travis.auto_signin', 'true')
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
    Travis.trigger('user:signed_in', user)
    @get('app.router').send('afterSignIn', @readAfterSignInPath())

  storeToken: (token) ->
    token = token || localStorage.getItem('travis.token')
    if token
      localStorage.setItem('travis.token', token)
      sessionStorage.setItem('travis.token', token)
      @notifyPropertyChange('accessToken')

  storeUser: (user) ->
    localStorage.setItem('travis.auto_signin', 'true')
    sessionStorage.setItem('travis.user', JSON.stringify(user))
    @app.store.load(Travis.User, user)
    user = @app.store.find(Travis.User, user.id)
    user.get('permissions')
    user

  storeAfterSignInPath: (path) ->
    sessionStorage.setItem('travis.after_signin_path', path)

  readAfterSignInPath: ->
    path = sessionStorage.getItem('travis.after_signin_path')
    sessionStorage.removeItem('travis.after_signin_path')
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
