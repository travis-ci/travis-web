Travis.BuildsController = Em.ArrayController.extend
  # sortAscending: false
  needs: ['repo']

  repoBinding: 'controllers.repo'
  buildsBinding: 'repo.builds'
  tabBinding: 'controllers.repo.tab'
