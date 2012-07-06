require 'controllers/base'

Travis.ProfileController = Travis.Controller.extend
  name: 'profile'

  init: ->
    @_super('top', 'user', 'hooks')

  connect: (parent) ->
    @_super(parent)
    @connectTop()

  viewShow: (params) ->
    @connectUser(@currentUser)
    @connectHooks(Travis.Hook.find())

  connectUser: (user) ->
    @profileController.connectOutlet(outletName: 'main', name: 'user', context: user)

  connectHooks: (hooks) ->
    @userController.connectOutlet(outletName: 'hooks', name: 'hooks', context: hooks) if hooks

