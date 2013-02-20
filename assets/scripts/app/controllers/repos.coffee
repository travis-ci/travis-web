require 'travis/limited_array'

Travis.ReposController = Ember.ArrayController.extend
  defaultTab: 'recent'
  isLoadedBinding: 'content.isLoaded'
  needs: ['currentUser']
  currentUserBinding: 'controllers.currentUser'

  init: ->
    Ember.run.later(@updateTimes.bind(this), Travis.INTERVALS.updateTimes)
    @_super.apply this, arguments

  recentRepos: (->
    Travis.LimitedArray.create
      content: Em.ArrayProxy.extend(Em.SortableMixin).create(
        sortProperties: ['sortOrder']
        content: Travis.Repo.find()
        isLoadedBinding: 'content.isLoaded'
      )
      limit: 30
  ).property()

  updateTimes: ->
    if content = @get('content')
      content.forEach (r) -> r.updateTimes()

    Ember.run.later(@updateTimes.bind(this), Travis.INTERVALS.updateTimes)

  activate: (tab, params) ->
    tab ||= @defaultTab
    @set('tab', tab)
    this["view#{$.camelize(tab)}"](params)

  viewRecent: ->
    @set('content', @get('recentRepos'))

  viewOwned: ->
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
