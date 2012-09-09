require 'controllers'

@Travis.AuthController = Travis.Controller.extend
  name: 'auth'

  init: ->
    @_super('top')
    @connectTop()
    @connectOutlet(outletName: 'main', controller: this, viewClass: Travis.AuthView)

  activate: (action, params) ->
    # noop


