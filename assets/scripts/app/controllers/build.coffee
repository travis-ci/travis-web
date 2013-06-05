Travis.BuildController = Ember.Controller.extend
  needs: ['repo']
  repoBinding: 'controllers.repo.repo'
  commitBinding: 'build.commit'
  lineNumberBinding: 'controllers.repo.lineNumber'

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
