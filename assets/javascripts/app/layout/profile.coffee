require 'layout/base'

Travis.Layout.Profile = Travis.Layout.Base.extend
  name: 'profile'

  init: ->
    @_super('profile', 'hooks')

  viewShow: (params) ->
    @connectProfile(Travis.Profile.find())
    @connectHooks(Travis.Hook.find())

  connectProfile: (profile) ->
    @profileController.connectOutlet(outletName: 'main', name: 'profile', context: profile)

  connectHooks: (hooks) ->
    @profileController.connectOutlet(outletName: 'hooks', name: 'hooks', context: hooks)

