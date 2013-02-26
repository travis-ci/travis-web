Travis.BuildsController = Em.ArrayController.extend
  # sortAscending: false
  needs: ['repo']

  repoBinding: 'controllers.repo.repo'
  buildsBinding: 'controllers.repo.builds'
  tabBinding: 'controllers.repo.tab'

  showMore: ->
    id     = @get('repo.id')
    number = @get('builds.lastObject.number')
    @get('builds').load Travis.Build.olderThanNumber(id, number, @get('tab'))

  displayShowMoreButton: (->
    @get('tab') != 'branches'
  ).property('tab')
