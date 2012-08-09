Travis.RepositoriesController = Ember.ArrayController.extend
  sortProperties: ['sortOrder']

  init: ->
    @activate('recent')
    Ember.run.later(@updateTimes.bind(this), Travis.INTERVALS.updateTimes)

  updateTimes: ->
    if content = @get('content')
      content.forEach (r) -> r.updateTimes()

    Ember.run.later(@updateTimes.bind(this), Travis.INTERVALS.updateTimes)

  activate: (tab, params) ->
    @set('tab', tab)
    this["view#{$.camelize(tab)}"](params)

  viewRecent: ->
    @set('content', Travis.Repository.find())

  viewOwned: (params) ->
    @set('content', Travis.Repository.owned_by(params.login))

  viewSearch: (params) ->
    @set('content', Travis.Repository.search(params.search))

  searchObserver: (->
    search = @get('search')
    tab = if search then 'search' else 'recent'
    @activate(tab, search: search)
  ).observes('search')


