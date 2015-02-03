`import Ember from 'ember'`

Controller = Ember.Controller.extend
  #queryParams: ['filter']
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

  updateFilter: () ->
    value = @get('_lastFilterValue')
    @transitionToRoute queryParams: { filter: value }
    #@set('filter', value)

  actions:
    updateFilter: (value) ->
      @set('_lastFilterValue', value)
      Ember.run.throttle this, @updateFilter, [], 200, false

`export default Controller`
