Travis.StatsController = Travis.Controller.extend
  name: 'stats'

  init: ->
    @_super.apply this, arguments
    #@connectOutlet(outletName: 'main', controller: this, viewClass: Travis.StatsView)

  activate: (action, params) ->
    # noop
