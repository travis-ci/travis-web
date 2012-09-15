Travis.AccountsController = Ember.ArrayController.extend
  defaultTab: 'accounts'

  init: ->
    @activate(@defaultTab)

  activate: (tab, params) ->
    @set('tab', tab)
    this["view#{$.camelize(tab)}"](params)

  viewAccounts: ->
    @set('content', Travis.app.get('currentUser.accounts'))
