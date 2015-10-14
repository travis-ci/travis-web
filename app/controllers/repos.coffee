`import Ember from 'ember'`
`import limit from 'travis/utils/computed-limit'`
`import Repo from 'travis/models/repo'`

Controller = Ember.Controller.extend
  contentBinding: 'repos'
  actions:
    activate: (name) ->
      @activate(name)

    showRunningJobs: ->
      @activate('running')

    showMyRepositories: ->
      # this is a bit of a hack. I don't want to switch URL for 'running'
      # so depending on current state I'm either just switching back or 
      # redirecting
      if @get('tab') == 'running'
        @activate('owned')
      else
        @transitionToRoute('main.repositories')


  tabOrIsLoadedDidChange: (->
    @possiblyRedirectToGettingStartedPage()
  ).observes('isLoaded', 'tab', 'repos.length')

  possiblyRedirectToGettingStartedPage: ->
    Ember.run.scheduleOnce 'routerTransitions', this, ->
      if @get('tab') == 'owned' && @get('isLoaded') && @get('repos.length') == 0
        @container.lookup('router:main').send('redirectToGettingStarted')

  isLoadedBinding: 'repos.isLoaded'
  needs: ['currentUser', 'repo']
  currentUserBinding: 'controllers.currentUser.model'
  selectedRepo: (->
    # we need to observe also repo.content here, because we use
    # ObjectProxy in repo controller
    # TODO: get rid of ObjectProxy there
    @get('controllers.repo.repo.content') || @get('controllers.repo.repo')
  ).property('controllers.repo.repo', 'controllers.repo.repo.content')

  startedJobsCount: Ember.computed.alias('runningJobs.length')
  allJobsCount: (->
    @get('startedJobsCount') + @get('queuedJobs.length')
  ).property('startedJobsCount', 'queuedJobs.length')

  init: ->
    @_super.apply this, arguments
    if !Ember.testing
      Visibility.every @config.intervals.updateTimes, @updateTimes.bind(this)

  runningJobs: (->
    result = @store.filter('job', {}, (job) ->
      ['queued', 'started', 'received'].indexOf(job.get('state')) != -1
    )
    result.set('isLoaded', false)
    result.then =>
      result.set('isLoaded', true)
    result
  ).property()

  queuedJobs: (->
    result = @get('store').filter('job', {}, (job) ->
      ['created'].indexOf(job.get('state')) != -1
    )
    result.set('isLoaded', false)
    result.then =>
      result.set('isLoaded', true)
    result
  ).property()

  recentRepos: (->
    # I return an empty array here, because we're removing left sidebar, but
    # I don't want to refactor too much code (it will be all changed anyway
    # when we switch to new dashboard)
    []
  ).property()

  updateTimes: ->
    if repos = @get('repos')
      repos.forEach (r) -> r.updateTimes()

  activate: (tab, params) ->
    @set('sortProperties', ['sortOrder'])
    @set('tab', tab)
    this["view_#{tab}".camelize()](params)

  viewOwned: ->
    @set('repos', @get('userRepos'))

  viewRunning: ->

  userRepos: (->
    if login = @get('currentUser.login')
      Repo.accessibleBy(@store, login)
    else
      []
  ).property('currentUser.login')

  viewSearch: (phrase) ->
    @set('search', phrase)
    @set('repos', Repo.search(@store, phrase))

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
