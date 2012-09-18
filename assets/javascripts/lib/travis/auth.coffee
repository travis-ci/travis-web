@Travis.Auth = ->
  $ =>
    @iframe.appendTo('body')
    window.addEventListener "message", (e) => @receiveMessage(e)
  this

$.extend Travis.Auth,
  instance: new Travis.Auth()

  signIn: ->
    @instance.signIn()

$.extend Travis.Auth.prototype,
  iframe: $('<iframe id="auth-frame" />').hide()

  expectedOrigin: ->
    if Travis.config.api_endpoint[0] == '/'
      window.location.protocol + "://" + window.location.host
    else
      Travis.config.api_endpoint

  receiveMessage: (event) ->
    if event.origin != @expectedOrigin()
      console.log("unexpected message #{event.origin}: #{event.data}")
    else
      Travis.config.access_token = event.data
      alert Travis.config.access_token

  trySignIn: ->
    @iframe.attr('src', "#{Travis.config.api_endpoint}/auth/post_message")
    console.log('sign in!')

  signIn: ->
    @trySignIn()
