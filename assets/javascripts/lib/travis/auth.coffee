@Travis.Auth = ->
  $ => @iframe.appendTo('body')
  this

$.extend Travis.Auth,
  instance: new Travis.Auth()

  signIn: ->
    @instance.signIn()

$.extend Travis.Auth.prototype,
  iframe: $('<iframe id="auth-frame" />').hide()

  signIn: ->
    @iframe.attr('src', "#{Travis.config.api_endpoint}/auth/post_message")
    @iframe.show()
    console.log('sign in!')
