@Travis.Auth = ->
  $ =>
    @iframe.appendTo('body')
    window.addEventListener "message", (e) => @receiveMessage(e)
  this

$.extend Travis.Auth,
  instance: new Travis.Auth()

  signIn: ->
    @instance.signIn()

  trySignIn: ->
    @instance.trySignIn()

$.extend Travis.Auth.prototype,
  iframe: $('<iframe id="auth-frame" />').hide()

  expectedOrigin: ->
    if Travis.config.api_endpoint[0] == '/'
      window.location.protocol + "//" + window.location.host
    else
      Travis.config.api_endpoint

  receiveMessage: (event) ->
    if event.origin != @expectedOrigin()
      console.log("unexpected message #{event.origin}: #{event.data}")
    else
      Travis.config.access_token = event.data.token
      Travis.app.setCurrentUser(event.data)
      console.log("signed in as #{event.data.user.login}")

  trySignIn: ->
    @iframe.attr('src', "#{Travis.config.api_endpoint}/auth/post_message")

  newUser: ->
    localStorage?.setItem("travisTrySignIn", "true")
    url = "#{Travis.config.api_endpoint}/auth/handshake?redirect_uri=#{window.location}"
    window.location = url

  checkUser: ->
    @newUser() unless Travis.config.access_token?

  signIn: ->
    @trySignIn()
    window.setTimeout((=> @checkUser()), 15000)
