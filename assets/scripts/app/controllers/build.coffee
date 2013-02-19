Travis.BuildController = Ember.Controller.extend
  needs: ['repo']
  repoBinding: 'controllers.repo.repo'
  buildBinding: 'controllers.repo.build'
  commitBinding: 'build.commit'

  currentItemBinding: 'build'

  loading: (->
    !@get('build.isLoaded')
  ).property('build.isLoaded')

  urlGithubCommit: (->
    Travis.Urls.githubCommit(@get('repo.slug'), @get('commit.sha'))
  ).property('repo.slug', 'commit.sha')

  urlAuthor: (->
    Travis.Urls.email(@get('commit.authorEmail'))
  ).property('commit.authorEmail')

  urlCommitter: (->
    Travis.Urls.email(@get('commit.committerEmail'))
  ).property('commit.committerEmail')
