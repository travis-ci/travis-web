Travis.AccountsController = Ember.ArrayController.extend
  tab: 'accounts'

  init: ->
    @_super()

  findByLogin: (login) ->
    @find (account) -> account.get('login') == login
