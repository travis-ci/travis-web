@Travis.Auth = Ember.Object.extend
  iframe: $('<iframe id="auth-frame" />').hide()
  timeout: 5000
  state: 'signed-out'
  receivingEnd: "#{location.protocol}//#{location.host}"

  init: ->
    @iframe.appendTo('body')
    window.addEventListener('message', (e) => @receiveMessage(e))
    Ember.run.next(this, @loadUser)

  # if the user is in the session storage, we're using it. if we have a flag
  # for auto signin then we're trying to sign in.
  loadUser: ->
    if user = sessionStorage?.getItem('travis.user')
      @setUser(user)
    else if localStorage?.getItem('travis.auto_signin')
      @trySignIn()

  # try signing in, but check later in case we have a timeout
  signIn: ->
    @trySignIn()
    Ember.run.later(this, @checkSignIn.bind(this), @timeout)

  trySignIn: ->
    @set('state', 'signing-in')
    @iframe.attr('src', "#{@endpoint}/auth/post_message?origin=#{@receivingEnd}")

  checkSignIn: ->
    @forceSignIn() if @get('state') == 'signing-in'

  forceSignIn: ->
    localStorage?.setItem('travis.auto_signin', 'true')
    url = "#{@endpoint}/auth/handshake?redirect_uri=#{location}"
    window.location = url

  signOut: ->
    localStorage?.clear()
    sessionStorage?.clear()
    @setUser()


  setUser: (data) ->
    data = JSON.parse(data) if typeof data == 'string'
    user = @storeUser(data) if data
    @set('state', if user then 'signed-in' else 'signed-out')
    @set('user',  if user then user else undefined)

  storeUser: (data) ->
    localStorage?.setItem('travis.auto_signin', 'true')
    sessionStorage?.setItem('travis.user', JSON.stringify(data))
    data.user.access_token = data.token # TODO why's the access_token not set on the user?
    @store.load(Travis.User, data.user)
    @store.loadMany(Travis.Account, data.accounts)
    Travis.User.find(data.user.id)

  receiveMessage: (event) ->
    if event.origin == @expectedOrigin()
      @setUser(event.data)
      console.log("signed in as #{event.data.user.login}")
    else
      console.log("unexpected message #{event.origin}: #{event.data}")

  expectedOrigin: ->
    if @endpoint[0] == '/' then @receivingEnd else @endpoint
