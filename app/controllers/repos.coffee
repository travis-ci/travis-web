`import Ember from 'ember'`
`import limit from 'travis/utils/computed-limit'`
`import Repo from 'travis/models/repo'`

Controller = Ember.ArrayController.extend
  actions:
    activate: (name) ->
      @activate(name)

    showRunningJobs: ->
      @activate('running')

    showMyRepositories: ->
      @activate('owned')


  tabOrIsLoadedDidChange: (->
    @possiblyRedirectToGettingStartedPage()
  ).observes('isLoaded', 'tab', 'length')

  possiblyRedirectToGettingStartedPage: ->
    Ember.run.scheduleOnce 'routerTransitions', this, ->
      if @get('tab') == 'owned' && @get('isLoaded') && @get('length') == 0
        @container.lookup('router:main').send('redirectToGettingStarted')

  isLoadedBinding: 'content.isLoaded'
  needs: ['currentUser', 'repo']
  currentUserBinding: 'controllers.currentUser'
  selectedRepo: (->
    # we need to observe also repo.content here, because we use
    # ObjectProxy in repo controller
    # TODO: get rid of ObjectProxy there
    @get('controllers.repo.repo.content') || @get('controllers.repo.repo')
  ).property('controllers.repo.repo', 'controllers.repo.repo.content')

  init: ->
    @_super.apply this, arguments
    if !Ember.testing
      Visibility.every @config.intervals.updateTimes, @updateTimes.bind(this)

  recentRepos: (->
    Ember.ArrayProxy.extend(
      isLoadedBinding: 'repos.isLoaded'
      repos: Repo.withLastBuild(@store)
      sorted: Ember.computed.sort('repos', 'sortedReposKeys')
      content: limit('sorted', 'limit')
      sortedReposKeys: ['sortOrder:asc']
      limit: 30
    ).create()
  ).property()

  updateTimes: ->
    if content = @get('content')
      content.forEach (r) -> r.updateTimes()

  activate: (tab, params) ->
    @set('sortProperties', ['sortOrder'])
    @set('tab', tab)
    this["view_#{tab}".camelize()](params)

  viewRecent: ->
    @set('content', @get('recentRepos'))

  viewOwned: ->
    @set('content', @get('userRepos'))

  viewRunning: ->

  userRepos: (->
    if login = @get('currentUser.login')
      Repo.accessibleBy(@store, login)
    else
      []
  ).property('currentUser.login')

  viewSearch: (phrase) ->
    @set('search', phrase)
    @set('content', Repo.search(@store, phrase))

  searchObserver: (->
    search = @get('search')
    if search
      @searchFor search
  ).observes('search')

  searchFor: (phrase) ->
    Ember.run.cancel(@searchLater) if @searchLater
    @searchLater = Ember.run.later(this, (->
      @transitionTo('main.search', phrase.replace(/\//g, '%2F'))
    ), 500)

  noReposMessage: (->
   tab = @get('tab')

   if tab == 'owned'
    'You don\'t have any repos set up on Travis CI'
   else if tab == 'recent'
    'Repositories could not be loaded'
   else
    'Could not find any repos'
  ).property('tab')

  showRunningJobs: (->
    @get('tab') == 'running'
  ).property('tab')

`export default Controller`
