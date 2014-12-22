Travis.JobController = Em.Controller.extend
  needs: ['repo']

  repoBinding: 'controllers.repo.repo'
  commitBinding: 'job.commit'
  annotationsBinding: 'job.annotations'
  currentUserBinding: 'controllers.repo.currentUser'
  tabBinding: 'controllers.repo.tab'

  currentItemBinding: 'job'

  urlGithubCommit: (->
    Travis.Urls.githubCommit(@get('repo.slug'), @get('commit.sha'))
  ).property('repo.slug', 'commit.sha')
