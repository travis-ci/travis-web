Travis.BuildsController = Em.ArrayController.extend
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
    @get('content').load Travis.Build.olderThanNumber(id, number, @get('tab'))

  displayShowMoreButton: (->
    @get('tab') != 'branches' and parseInt(@get('lastObject.number')) > 1
  ).property('tab', 'lastObject.number')
