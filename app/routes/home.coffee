`import BasicRoute from 'travis/routes/basic'`
`import config from 'travis/config/environment'`
`import limit from 'travis/utils/computed-limit'`

Route = BasicRoute.extend
  init: ->
    store = @store
    repos = Ember.ArrayProxy.extend(
      isLoadedBinding: 'repos.isLoaded'
      repos: []
      sorted: Ember.computed.sort('repos', 'sortedReposKeys')
      content: limit('sorted', 'limit')
      sortedReposKeys: ['sortOrderForLandingPage:desc']
      limit: 3
    ).create()

    @set('repos', repos)

    @loadMoreRepos()

    @_super.apply this, arguments

  loadMoreRepos: ->
    @store.findAll('build').then (builds) =>
      repoIds = builds.mapBy('data.repo').uniq()
      repos = @get('repos.repos')
      @store.query('repo', ids: repoIds).then (reposFromRequest) =>
        reposFromRequest.toArray().forEach (repo) ->
          repos.pushObject(repo) unless repos.contains(repo)

  activate: ->
    @_super.apply(this, arguments)

    interval = setInterval( =>
      @loadMoreRepos()
    , 60000)
    @set('interval', interval)

    @controllerFor('top').set('landingPage', true)

  deactivate: ->
    @_super.apply(this, arguments)

    if interval = @get('interval')
      clearInterval(interval)

    @controllerFor('top').set('landingPage', false)

  setupController: (controller, model) ->
    controller.set('repos', @get('repos'))

`export default Route`
