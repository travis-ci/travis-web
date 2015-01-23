Controller = Ember.Controller.extend
  queryParams: ['filter']
  filter: null

  filteredRepositories: (->
    filter = @get('filter')
    repos = @get('model')

    if filter
      repos.filter (item, index) ->

        item.slug.match(new RegExp(filter))

    else
      repos

  ).property('filter', 'model')

Travis.DashboardRepositoriesController = Controller
