Travis.AccountsController = Ember.ArrayController.extend
  tab: 'accounts'

  findByLogin: (login) ->
    @find (account) -> account.get('login') == login
