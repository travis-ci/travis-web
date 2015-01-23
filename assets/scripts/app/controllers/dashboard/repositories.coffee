Controller = Ember.Controller.extend
  queryParams: ['filter']
  filter: null

  filteredRepositories: (->
    filter = @get('filter')
    repos = @get('model')

    if Ember.isBlank(filter)
      repos
    else
      repos.filter (item, index) ->
        item.slug.match(new RegExp(filter))

  ).property('filter', 'model')

Travis.DashboardRepositoriesController = Controller
