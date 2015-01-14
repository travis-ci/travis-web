require 'routes/route'
require 'models/account'

Account = Travis.Account
TravisRoute = Travis.Route

Route = TravisRoute.extend
  model: ->
    Account.fetch(all: true)

  renderTemplate: ->
    @_super.apply(this, arguments)
    @render 'profile_accounts', outlet: 'left', into: 'profile'


Travis.AccountsRoute = Route
