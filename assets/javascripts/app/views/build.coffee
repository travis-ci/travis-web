@Travis.Views.reopen
  BuildsView: Em.View.extend
    templateName: 'builds/list'

  BuildsItemView: Em.View.extend
    buildBinding: 'context'
    repositoryBinding: 'controller.repository'

    color: (->
      Travis.Helpers.colorForResult(@getPath('context.result'))
    ).property('build.result')

    urlBuild: (->
      Travis.Urls.build(@getPath('repository.slug'), @getPath('build.id'))
    ).property('repository.slug', 'build.id')

  BuildView: Em.View.extend
    templateName: 'builds/show'

    buildBinding: 'controller.build'
    repositoryBinding: 'controller.repository'

    color: (->
      Travis.Helpers.colorForResult(@getPath('build.result'))
    ).property('build.result')

    urlBuild: (->
      Travis.Urls.build(@getPath('repository.slug'), @getPath('build.id'))
    ).property('repository.slug', 'build.id')

    requiredJobs: (->
      jobs = @getPath('build.jobs')
      jobs.filter((job) -> job.get('allow_failure') != true) if jobs
    ).property('build.jobs')

    allowedFailureJobs: (->
      jobs = @getPath('build.jobs')
      jobs.filter((job) -> job.get('allow_failure')) if jobs
    ).property('build.jobs')


