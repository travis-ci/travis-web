require 'travis/limited_array'

Travis.ReposController = Ember.ArrayController.extend
  defaultTab: ( ->
    if @get('currentUser.id')
      'owned'
    else
      'recent'
  ).property('currentUser')

  currentUserIdDidChange: (->
    if @get('currentUser.id')
      @activate('owned')
    else if @get('tab') == 'owned'
      @activate('recent')
  ).observes('currentUser.id')

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
    Ember.run.later(@updateTimes.bind(this), Travis.INTERVALS.updateTimes)

  recentRepos: (->
    Travis.Repo.find()
    Travis.LimitedArray.create
      content: Em.ArrayProxy.extend(Em.SortableMixin).create(
        sortProperties: ['sortOrder']
        content: Travis.Repo.withLastBuild()
        isLoadedBinding: 'content.isLoaded'
      )
      limit: 30
  ).property()

  updateTimes: ->
    if content = @get('content')
      content.forEach (r) -> r.updateTimes()

    Ember.run.later(@updateTimes.bind(this), Travis.INTERVALS.updateTimes)

  activate: (tab, params) ->
    @set('sortProperties', null)
    tab ||= @get('defaultTab')
    @set('tab', tab)
    this["view#{$.camelize(tab)}"](params)

  viewRecent: ->
    @set('content', @get('recentRepos'))

  viewOwned: ->
    @set('sortProperties', ['sortOrder'])
    @set('content', Travis.Repo.accessibleBy(@get('currentUser.login')))

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
