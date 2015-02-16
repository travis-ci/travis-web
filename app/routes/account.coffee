`import TravisRoute from 'travis/routes/basic'`

Route = TravisRoute.extend
  titleToken: (model) ->
    model.get('name') || model.get('login')

  setupController: (controller, account) ->
    @_super.apply this, arguments

    @controllerFor('profile').activate 'hooks'

  model: (params) ->
    @modelFor('accounts').find (account) -> account.get('login') == params.login

  serialize: (account) ->
    if account && account.get
      { login: account.get('login') }
    else
      {}

`export default Route`
