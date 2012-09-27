@Travis.Auth = Ember.Object.extend
  iframe: $('<iframe id="auth-frame" />').hide()
  timeout: 5000
  state: 'signed-out'
  receivingEnd: "#{location.protocol}//#{location.host}"

  init: ->
    @iframe.appendTo('body')
    window.addEventListener('message', (e) => @receiveMessage(e))
    Ember.run.next(this, @loadUser)

  accessToken: (->
    sessionStorage.getItem('travis.token')
  ).property()

  # if the user is in the session storage, we're using it. if we have a flag
  # for auto signin then we're trying to sign in.
  loadUser: ->
    if user = sessionStorage?.getItem('travis.user')
      @setData(user: JSON.parse(user))
    else if localStorage?.getItem('travis.auto_signin')
      @trySignIn()

  # try signing in, but check later in case we have a timeout
  signIn: ->
    @set('state', 'signing-in')
    @trySignIn()
    Ember.run.later(this, @checkSignIn.bind(this), @timeout)

  trySignIn: ->
    @iframe.attr('src', "#{@endpoint}/auth/post_message?origin=#{@receivingEnd}")

  checkSignIn: ->
    @forceSignIn() if @get('state') == 'signing-in'

  forceSignIn: ->
    localStorage?.setItem('travis.auto_signin', 'true')
    window.location = "#{@endpoint}/auth/handshake?redirect_uri=#{location}"

  signOut: ->
    localStorage?.clear()
    sessionStorage?.clear()
    @setData()

  setData: (data) ->
    data = JSON.parse(data) if typeof data == 'string'
    @storeToken(data.token) if data?.token
    user = @storeUser(data.user) if data?.user
    @set('state', if user then 'signed-in' else 'signed-out')
    @set('user',  if user then user else undefined)

  storeToken: (token) ->
    sessionStorage?.setItem('travis.token', token)
    @notifyPropertyChange('accessToken')

  storeUser: (user) ->
    localStorage?.setItem('travis.auto_signin', 'true')
    sessionStorage?.setItem('travis.user', JSON.stringify(user))
    @store.load(Travis.User, user)
    Travis.User.find(user.id)

  receiveMessage: (event) ->
    if event.origin == @expectedOrigin()
      @setData(event.data)
      console.log("signed in as #{event.data.user.login}")
    else
      console.log("unexpected message #{event.origin}: #{event.data}")

  expectedOrigin: ->
    if @endpoint[0] == '/' then @receivingEnd else @endpoint
