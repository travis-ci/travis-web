Travis.JobController = Em.Controller.extend
  needs: ['repo']

  jobBinding: 'controllers.repo.job'
  repoBinding: 'controllers.repo.repo'
  commitBinding: 'job.commit'

  currentItemBinding: 'job'

  urlGithubCommit: (->
    Travis.Urls.githubCommit(@get('repo.slug'), @get('commit.sha'))
  ).property('repo.slug', 'commit.sha')

  urlAuthor: (->
    Travis.Urls.email(@get('commit.authorEmail'))
  ).property('commit.authorEmail')

  urlCommitter: (->
    Travis.Urls.email(@get('commit.committerEmail'))
  ).property('commit.committerEmail')
