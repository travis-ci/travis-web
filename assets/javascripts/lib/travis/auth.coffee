class @Travis.Auth
  constructor: ->
    @iframe = $('<iframe />')
    @iframe.hide()

  signIn: ->
    alert 'sign in not implemented'

  @instance: new @
  @signIn: -> @instance.signIn()
