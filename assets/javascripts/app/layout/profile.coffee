require 'layout/base'

Travis.Layout.Profile = Travis.Layout.Base.extend
  name: 'profile'

  init: ->
    @_super('top', 'profile', 'hooks')
    @connectHead(@currentUser)

  viewShow: (params) ->
    if @currentUser
      @connectProfile(@currentUser)
      @connectHooks(Travis.Hook.find())

  connectHead:(user) ->
    @profileController.connectOutlet(outletName: 'top', name: 'top')
    @topController.set('user', user)

  connectProfile: (user) ->
    @profileController.connectOutlet(outletName: 'main', name: 'profile', context: user)

  connectHooks: (hooks) ->
    @profileController.connectOutlet(outletName: 'hooks', name: 'hooks', context: hooks)

