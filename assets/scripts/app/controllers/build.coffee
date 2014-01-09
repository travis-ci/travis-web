Travis.BuildController = Ember.Controller.extend
  needs: ['repo']
  repoBinding: 'controllers.repo.repo'
  commitBinding: 'build.commit'
  currentUserBinding: 'controllers.repo.currentUser'
  tabBinding: 'controllers.repo.tab'

  currentItemBinding: 'build'

  loading: (->
    @get('build.isLoading')
  ).property('build.isLoading')

  urlGithubCommit: (->
    Travis.Urls.githubCommit(@get('repo.slug'), @get('commit.sha'))
  ).property('repo.slug', 'commit.sha')
