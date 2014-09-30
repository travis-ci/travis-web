Travis.BuildController = Ember.Controller.extend Travis.GithubUrlProperties,
  needs: ['repo']
  repoBinding: 'controllers.repo.repo'
  commitBinding: 'build.commit'
  currentUserBinding: 'controllers.repo.currentUser'
  tabBinding: 'controllers.repo.tab'

  currentItemBinding: 'build'

  loading: (->
    @get('build.isLoading')
  ).property('build.isLoading')
