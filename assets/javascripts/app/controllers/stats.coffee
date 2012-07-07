require 'controllers/base'

Travis.StatsController = Travis.Controller.extend
  name: 'stats'

  init: ->
    @_super('top')
    @connectTop()
    @connectOutlet(outletName: 'main', controller: this, viewClass: Travis.StatsView)

  activate: (action, params) ->
    # noop
