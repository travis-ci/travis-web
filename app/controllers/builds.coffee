`import Ember from 'ember'`

Controller = Ember.ArrayController.extend
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
    type   = if @get('tab') == "builds" then 'push' else 'pull_request'
    @get('content').load @olderThanNumber(id, number, type)

  displayShowMoreButton: (->
    @get('tab') != 'branches' and parseInt(@get('lastObject.number')) > 1
  ).property('tab', 'lastObject.number')

  displayPullRequests: (->
    if Ember.isEmpty(@get('repo.builds.content'))
      return false # if there is no build there is no PR
    else if Ember.isEmpty(@get('repo.pullRequests.content'))
      return true
    else
      return false

  ).property('tab', 'lastObject.number')

  olderThanNumber: (id, number, type) ->
    options = { repository_id: id, after_number: number }
    if type?
      options.event_type = type.replace(/s$/, '') # poor man's singularize

    @store.find('build', options)

`export default Controller`
