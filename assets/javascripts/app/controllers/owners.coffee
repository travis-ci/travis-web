Travis.OwnersController = Ember.ArrayController.extend
  defaultTab: 'accounts'

  init: ->
    @activate(@defaultTab)

  activate: (tab, params) ->
    @set('tab', tab)
    this["view#{$.camelize(tab)}"](params)

  viewAccounts: ->
    @set('content', Travis.Owner.find())
