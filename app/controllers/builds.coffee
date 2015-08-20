`import Ember from 'ember'`

Controller = Ember.ArrayController.extend
  sortAscending: false
  sortProperties: ['number']

  repoController: Ember.inject.controller('repo')

  repoBinding: 'repoController.repo'
  tabBinding: 'repoController.tab'
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
    if @get('tab') == 'pull_requests'
      if Ember.isEmpty(@get('repo.pullRequests.content'))
        true
      else
        false
    else
      false
  ).property('tab', 'repo.builds', 'repo.pullRequests')

  displayBranches: (->
    if @get('tab') == 'branches'
      if Ember.isEmpty(@get('repo.branches.content.content'))
        true
      else
        false
    else
      false
  ).property('tab', 'repo.builds', 'repo.branches')

  noticeData: (->
    return {
      repo: @get('repo'),
      auth: @auth.token()
    }
  ).property('repo')

  olderThanNumber: (id, number, type) ->
    options = { repository_id: id, after_number: number }
    if type?
      options.event_type = type.replace(/s$/, '') # poor man's singularize

    @store.query('build', options)

  actions:
    showMoreBuilds: ->
      @showMore()


`export default Controller`
