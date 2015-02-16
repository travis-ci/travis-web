`import TravisRoute from 'travis/routes/basic'`

Route = TravisRoute.extend
  model: ->
    @store.find('account', { all: true })

  renderTemplate: ->
    @_super.apply(this, arguments)
    @render 'profile_accounts', outlet: 'left', into: 'profile'


`export default Route`
