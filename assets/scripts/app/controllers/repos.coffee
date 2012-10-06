Travis.ReposController = Ember.ArrayController.extend
  defaultTab: 'recent'
  sortProperties: ['sortOrder']

  init: ->
    @activate(@defaultTab)
    Ember.run.later(@updateTimes.bind(this), Travis.INTERVALS.updateTimes)

  updateTimes: ->
    if content = @get('content')
      content.forEach (r) -> r.updateTimes()

    Ember.run.later(@updateTimes.bind(this), Travis.INTERVALS.updateTimes)

  activate: (tab, params) ->
    @set('tab', tab)
    this["view#{$.camelize(tab)}"](params)

  viewRecent: ->
    @set('content', Travis.Repo.find())

  viewOwned: ->
    @set('content', Travis.Repo.ownedBy(Travis.app.get('currentUser.login')))

  viewSearch: (params) ->
    @set('content', Travis.Repo.search(params.search))

  searchObserver: (->
    search = @get('search')
    tab = if search then 'search' else 'recent'
    @activate(tab, search: search)
  ).observes('search')


