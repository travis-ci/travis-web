Travis.GithubUrlProperties = Ember.Mixin.create
  urlGithubCommit: (->
    Travis.Urls.githubCommit(@get('repo.slug'), @get('commit.sha'))
  ).property('repo.slug', 'commit.sha')

  urlGithubPullRequest: (->
    Travis.Urls.githubPullRequest(@get('repo.slug'), @get('build.pullRequestNumber'))
  ).property('repo.slug', 'build.pullRequestNumber')
