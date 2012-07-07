@Travis.reopen
  BuildsView: Em.View.extend
    templateName: 'builds/list'
    buildsBinding: 'controller'

  BuildsItemView: Em.View.extend
    repositoryBinding: 'controller.repository'
    buildBinding: 'context'
    commitBinding: 'build.commit'

    color: (->
      Travis.Helpers.colorForResult(@getPath('build.result'))
    ).property('build.result')

    urlBuild: (->
      Travis.Urls.build(@getPath('repository.slug'), @getPath('build.id'))
    ).property('repository.slug', 'build.id')

    urlGithubCommit: (->
      Travis.Urls.githubCommit(@getPath('repository.slug'), @getPath('commit.sha'))
    ).property('repository.slug', 'commit.sha')

  BuildView: Em.View.extend
    templateName: 'builds/show'

    repositoryBinding: 'controller.repository'
    buildBinding: 'controller.build'
    commitBinding: 'build.commit'

    color: (->
      Travis.Helpers.colorForResult(@getPath('build.result'))
    ).property('build.result')

    urlBuild: (->
      Travis.Urls.build(@getPath('repository.slug'), @getPath('build.id'))
    ).property('repository.slug', 'build.id')

    urlGithubCommit: (->
      Travis.Urls.githubCommit(@getPath('repository.slug'), @getPath('commit.sha'))
    ).property('repository.slug', 'commit.sha')

    urlAuthor: (->
      Travis.Urls.email(@getPath('commit.authorEmail'))
    ).property('commit.authorEmail')

    urlCommitter: (->
      Travis.Urls.email(@getPath('commit.committerEmail'))
    ).property('commit.committerEmail')

    requiredJobs: (->
      jobs = @getPath('build.jobs')
      jobs.filter((job) -> job.get('allow_failure') != true) if jobs
    ).property('build.jobs')

    allowedFailureJobs: (->
      jobs = @getPath('build.jobs')
      jobs.filter((job) -> job.get('allow_failure')) if jobs
    ).property('build.jobs')
