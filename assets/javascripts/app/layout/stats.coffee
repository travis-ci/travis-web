require 'layout/base'

Travis.Layout.Stats = Travis.Layout.Base.extend
  name: 'stats'

  init: ->
    @_super('top', 'stats', 'hooks')

  viewShow: (params) ->
    if @currentUser
      @connectStats()

  connectStats: () ->
    @statsController.connectOutlet(outletName: 'main', name: 'stats')

