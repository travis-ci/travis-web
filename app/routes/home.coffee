`import BasicRoute from 'travis/routes/basic'`
`import config from 'travis/config/environment'`
`import Repo from 'travis/models/repo'`
`import limit from 'travis/utils/computed-limit'`

Route = BasicRoute.extend
  activate: ->
    if !config.pro && @pusher
      @pusher.subscribeAll(['common'])

    @_super.apply(this, arguments)
    @store.set('isLandingPageOpened', true)

  deactivate: ->
    @_super.apply(this, arguments)
    @store.set('isLandingPageOpened', false)

  setupController: (controller, model) ->
    repos = Ember.ArrayProxy.extend(
      isLoadedBinding: 'repos.isLoaded'
      repos: Repo.withLastBuild(@store)
      sorted: Ember.computed.sort('repos', 'sortedReposKeys')
      content: limit('sorted', 'limit')
      sortedReposKeys: ['sortOrder:asc']
      limit: 3
    ).create()

    controller.set('repos', repos)

`export default Route`
