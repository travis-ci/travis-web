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
    if @get('tab') == 'pull_requests'
      if Ember.isEmpty(@get('repo.pullRequests.content'))
        true
      else
        false
    else
      false
  ).property('tab', 'repo.builds', 'repo.pullRequests')

  things: (->
    return {
      repo: @get('repo'),
      auth: @auth.token()
    }
  ).property('repo')

  olderThanNumber: (id, number, type) ->
    options = { repository_id: id, after_number: number }
    if type?
      options.event_type = type.replace(/s$/, '') # poor man's singularize

    @store.find('build', options)


`export default Controller`
