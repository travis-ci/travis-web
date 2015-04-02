`import BasicRoute from 'travis/routes/basic'`
`import config from 'travis/config/environment'`
`import limit from 'travis/utils/computed-limit'`

Route = BasicRoute.extend
  init: ->
    store = @store
    repos = Ember.ArrayProxy.extend(
      isLoadedBinding: 'repos.isLoaded'
      repos: @store.filter 'repo', (repo) ->
        buildId = repo.get('lastBuildId')
        store.hasRecordForId('build', buildId)
      sorted: Ember.computed.sort('repos', 'sortedReposKeys')
      content: limit('sorted', 'limit')
      sortedReposKeys: ['sortOrder:asc']
      limit: 3
    ).create()

    @set('repos', repos)

    setInterval =>
      @set('letMoreReposThrough', true)
    , 5000

    @_super.apply this, arguments

  activate: ->
    if !config.pro && @pusher
      @pusher.subscribeAll(['common'])

    @store.addPusherEventHandlerGuard('landing-page', (event, data) =>
      @allowMoreRepos(event, data)
    )

    @_super.apply(this, arguments)

    @controllerFor('top').set('landingPage', true)

  allowMoreRepos: (event, data) ->
    if @get('repos.length') < 3
      return true

    if event == 'build:started' && @get('letMoreReposThrough')
      @set('letMoreReposThrough', false)
      return true

  deactivate: ->
    @_super.apply(this, arguments)

    @store.removePusherEventHandlerGuard('landing-page')
    @controllerFor('top').set('landingPage', false)

  setupController: (controller, model) ->
    controller.set('repos', @get('repos'))

`export default Route`
