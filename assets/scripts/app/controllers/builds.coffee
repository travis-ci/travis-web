Travis.BuildsController = Em.ArrayController.extend
  sortAscending: false
  sortProperties: ['number']

  needs: ['repo']

  repoBinding: 'controllers.repo.repo'
  contentBinding: 'controllers.repo.builds'
  tabBinding: 'controllers.repo.tab'
  isLoadedBinding: 'content.isLoaded'

  showMore: ->
    id     = @get('repo.id')
    number = @get('lastObject.number')
    @get('content').load Travis.Build.olderThanNumber(id, number, @get('tab'))

  displayShowMoreButton: (->
    @get('tab') != 'branches'
  ).property('tab')
