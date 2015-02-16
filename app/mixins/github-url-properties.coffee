`import { githubCommit, githubPullRequest } from 'travis/utils/urls'`

mixin = Ember.Mixin.create
  urlGithubCommit: (->
    githubCommit(@get('repo.slug'), @get('commit.sha'))
  ).property('repo.slug', 'commit.sha')

  urlGithubPullRequest: (->
    githubPullRequest(@get('repo.slug'), @get('build.pullRequestNumber'))
  ).property('repo.slug', 'build.pullRequestNumber')

`export default mixin`
