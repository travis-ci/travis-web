Travis.reopen
  JobsView: Travis.View.extend
    templateName: 'jobs/list'
    buildBinding: 'controller.build'

  JobsItemView: Travis.View.extend
    tagName: 'tr'
    classNameBindings: ['color']
    repoBinding: 'context.repo'
    jobBinding: 'context'

    color: (->
      Travis.Helpers.colorForState(@get('job.state'))
    ).property('job.state')

  JobView: Travis.View.extend
    templateName: 'jobs/show'

    repoBinding: 'controller.repo'
    jobBinding: 'controller.job'
    commitBinding: 'job.commit'
    annotationsBinding: 'job.annotations'

    currentItemBinding: 'job'

    color: (->
      Travis.Helpers.colorForState(@get('job.state'))
    ).property('job.state')

    urlGithubCommit: (->
      Travis.Urls.githubCommit(@get('repo.slug'), @get('commit.sha'))
    ).property('repo.slug', 'commit.sha')

    urlAuthor: (->
      Travis.Urls.email(@get('commit.authorEmail'))
    ).property('commit.authorEmail')

    urlCommitter: (->
      Travis.Urls.email(@get('commit.committerEmail'))
    ).property('commit.committerEmail')
