require 'routes/basic'

TravisRoute = Travis.BasicRoute

Route = TravisRoute.extend
  redirect: ->
    # TODO: setting accounts model in ProfileRoute is wrong, but
    #       at this stage it's better than what we had before
    accounts = @modelFor('accounts')
    login    = @controllerFor('currentUser').get('login')
    account  = accounts.find (account) -> account.get('login') == login
    @replaceWith 'account', account


Travis.AccountsIndexRoute = Route
