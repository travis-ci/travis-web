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
        if store.hasRecordForId('build', buildId)
          state = repo.get('lastBuild.state')
          state == 'passed' || state == 'failed'
      external: []
      withExternal: Ember.computed.union('repos', 'external')
      sorted: Ember.computed.sort('withExternal', 'sortedReposKeys')
      content: limit('sorted', 'limit')
      sortedReposKeys: ['sortOrderForLandingPage:desc']
      limit: 3
    ).create()

    @set('repos', repos)

    setInterval =>
      @set('letMoreReposThrough', true)
    , 5000

    setTimeout =>
      unless repos.get('length')
        @store.find('build').then (builds) =>
          repoIds = builds.mapBy('data.repo').uniq().slice(0, 3)
          @store.find('repo', ids: repoIds).then (reposFromRequest) ->
            repos.get('external').pushObjects reposFromRequest.toArray()
    , 10000

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

    if event == 'build:finished' &&
         ['passed', 'failed'].indexOf(data.build.state) != -1 &&
         @get('letMoreReposThrough')
      @set('letMoreReposThrough', false)
      return true

  deactivate: ->
    @_super.apply(this, arguments)

    @store.removePusherEventHandlerGuard('landing-page')
    @controllerFor('top').set('landingPage', false)

  setupController: (controller, model) ->
    controller.set('repos', @get('repos'))

`export default Route`
