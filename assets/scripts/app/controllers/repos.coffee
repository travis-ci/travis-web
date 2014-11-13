require 'travis/limited_array'

Travis.ReposController = Ember.ArrayController.extend
  actions:
    activate: (name) ->
      @transitionToRoot()
      @activate(name)

  defaultTab: ( ->
    if @get('currentUser.id')
      'owned'
    else
      'recent'
  ).property('currentUser.id')

  currentUserIdDidChange: (->
    if @get('currentUser.id')
      @activate('owned')
    else if @get('tab') == 'owned'
      @activate('recent')
  ).observes('currentUser.id')

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
    Visibility.every Travis.INTERVALS.updateTimes, @updateTimes.bind(this)

  recentRepos: (->
    Ember.ArrayProxy.extend(
      isLoadedBinding: 'repos.isLoaded'
      repos: Travis.Repo.withLastBuild()
      sorted: Ember.computed.sort('repos', 'sortedReposKeys')
      content: Ember.computed.limit('sorted', 'limit')
      sortedReposKeys: ['sortOrder:asc']
      limit: 30
    ).create()
  ).property()

  updateTimes: ->
    if content = @get('content')
      content.forEach (r) -> r.updateTimes()

  transitionToRoot: ->
    @container.lookup('router:main').send('renderDefaultTemplate')
    @container.lookup('router:main').transitionTo('index.current')

  activate: (tab, params) ->
    @set('sortProperties', ['sortOrder'])
    tab ||= @get('defaultTab')
    @set('tab', tab)
    this["view#{$.camelize(tab)}"](params)

  viewRecent: ->
    @set('content', @get('recentRepos'))

  viewOwned: ->
    @set('content', @get('userRepos'))

  userRepos: (->
    if login = @get('currentUser.login')
      Travis.Repo.accessibleBy(login)
    else
      []
  ).property('currentUser.login')

  viewSearch: (params) ->
    @set('content', Travis.Repo.search(params.search))

  searchObserver: (->
    search = @get('search')
    if search
      @searchFor search
    else
      @activate 'recent'
      'recent'
  ).observes('search')

  searchFor: (phrase) ->
    Ember.run.cancel(@searchLater) if @searchLater
    @searchLater = Ember.run.later(this, (->
      @activate 'search', search: phrase
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
