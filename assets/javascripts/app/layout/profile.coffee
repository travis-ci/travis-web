require 'layout/base'

Travis.Layout.Profile = Travis.Layout.Base.extend
  name: 'profile'

  init: ->
    @_super('top', 'user', 'hooks')

  viewShow: (params) ->
    @connectUser(@currentUser)
    @connectHooks(Travis.Hook.find())

  connectUser: (user) ->
    @profileController.connectOutlet(outletName: 'main', name: 'user', context: user)

  connectHooks: (hooks) ->
    @userController.connectOutlet(outletName: 'hooks', name: 'hooks', context: hooks) if hooks

