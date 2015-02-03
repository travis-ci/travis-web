colorForState = Travis.Helpers.colorForState
githubCommit = Travis.Urls.githubCommit
gravatarImage = Travis.Urls.gravatarImage

View = Ember.View.extend
  repoBinding: 'controller.repo'
  jobBinding: 'controller.job'
  commitBinding: 'job.commit'
  annotationsBinding: 'job.annotations'

  currentItemBinding: 'job'

  color: (->
    colorForState(@get('job.state'))
  ).property('job.state')

  urlGithubCommit: (->
    githubCommit(@get('repo.slug'), @get('commit.sha'))
  ).property('repo.slug', 'commit.sha')

  urlCommitterGravatarImage: (->
    gravatarImage(@get('commit.committerEmail'), 40)
  ).property('commit.committerEmail')

  urlAuthorGravatarImage: (->
    gravatarImage(@get('commit.authorEmail'), 40)
  ).property('commit.authorEmail')

Travis.JobView = View
