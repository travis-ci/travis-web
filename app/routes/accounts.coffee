`import TravisRoute from 'travis/routes/basic'`

Route = TravisRoute.extend
  model: ->
    @store.query('account', { all: true })

  setupController: (controller, model) ->
    user = model.filterBy('type', 'user')[0]
    orgs = model.filterBy('type', 'organization')

    controller.set('user', user)
    controller.set('organizations', orgs)

    controller.set('model', model)

  renderTemplate: ->
    @_super.apply(this, arguments)
    @render 'profile_accounts', outlet: 'left', into: 'profile'


`export default Route`
