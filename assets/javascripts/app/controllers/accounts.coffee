Travis.AccountsController = Ember.ArrayController.extend
  tab: 'accounts'

  init: ->
    @_super()

  content: (->
    Travis.Account.find()
  ).property()

  findByLogin: (login) ->
    @find (account) -> account.get('login') == 'login'
