Travis.BuildController = Ember.Controller.extend
  needs: ['repo', 'log']
  repoBinding: 'controllers.repo.repo'
  buildBinding: 'controllers.repo.build'
  commitBinding: 'build.commit'
  jobBinding: 'controllers.log.job'

  currentItemBinding: 'build'

  loading: (->
    @get('build.isLoading')
  ).property('build.isLoading')

  urlGithubCommit: (->
    Travis.Urls.githubCommit(@get('repo.slug'), @get('commit.sha'))
  ).property('repo.slug', 'commit.sha')

  urlAuthor: (->
    Travis.Urls.email(@get('commit.authorEmail'))
  ).property('commit.authorEmail')

  urlCommitter: (->
    Travis.Urls.email(@get('commit.committerEmail'))
  ).property('commit.committerEmail')

  hasLoaded: (->
    @set('controllers.log.job', @get('build.firstJob')) if @get('build.isLoaded') && !@get('build.isMatrix')
  ).observes('build.id', 'loading')
