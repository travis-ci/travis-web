githubCommit = Travis.Urls.githubCommit
githubPullRequest = Travis.Urls.githubPullRequest

mixin = Ember.Mixin.create
  urlGithubCommit: (->
    githubCommit(@get('repo.slug'), @get('commit.sha'))
  ).property('repo.slug', 'commit.sha')

  urlGithubPullRequest: (->
    githubPullRequest(@get('repo.slug'), @get('build.pullRequestNumber'))
  ).property('repo.slug', 'build.pullRequestNumber')

Travis.GithubUrlProperties = mixin
