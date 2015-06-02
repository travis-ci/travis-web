`import TravisRoute from 'travis/routes/basic'`

Route = TravisRoute.extend
  redirect: ->
    # TODO: setting accounts model in ProfileRoute is wrong, but
    #       at this stage it's better than what we had before
    accounts = @modelFor('accounts')
    login    = @controllerFor('currentUser').get('model.login')
    account  = accounts.find (account) -> account.get('login') == login
    @replaceWith 'account', account

`export default Route`
