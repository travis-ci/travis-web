`import Ember from 'ember'`

Controller = Ember.ArrayController.extend
  isPullRequestsList: false

  sortAscending: false
  sortProperties: ['number']

  needs: ['repo']

  repoBinding: 'controllers.repo.repo'
  tabBinding: 'controllers.repo.tab'
  isLoadedBinding: 'content.isLoaded'
  isLoadingBinding: 'content.isLoading'

  showMore: ->
    id     = @get('repo.id')
    number = @get('lastObject.number')
    @get('content').load @olderThanNumber(id, number, @get('tab'))

  displayShowMoreButton: (->
    @get('tab') != 'branches' and parseInt(@get('lastObject.number')) > 1
  ).property('tab', 'lastObject.number')

  olderThanNumber: (id, number, type) ->
    options = { repository_id: id, after_number: number }
    if type?
      options.event_type = type.replace(/s$/, '') # poor man's singularize

    @store.find('build', options)

`export default Controller`
