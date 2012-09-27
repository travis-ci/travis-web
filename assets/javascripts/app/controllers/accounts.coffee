Travis.AccountsController = Ember.ArrayController.extend
  defaultTab: 'accounts'

  init: ->
    @_super()
    @activate(@defaultTab)

  activate: (tab, params) ->
    @set('tab', tab)
    this["view#{$.camelize(tab)}"](params)

  viewAccounts: ->
    @set('content', Travis.Account.find())

  findByLogin: (login) ->
    @find (account) -> account.get('login') == 'login'
