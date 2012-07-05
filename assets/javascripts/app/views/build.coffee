@Travis.Views.reopen
  BuildsView: Em.View.extend
    templateName: 'builds/list'

  BuildsItemView: Em.View.extend
    color: (->
      Travis.Helpers.colorForResult(@getPath('context.result'))
    ).property('context.result')

    urlBuild: (->
      Travis.Urls.build(@getPath('context.repository'), @get('context'))
    ).property('context.repository.slug', 'context')

  BuildView: Em.View.extend
    templateName: 'builds/show'

    color: (->
      Travis.Helpers.colorForResult(@getPath('controller.build.result'))
    ).property('controller.build.result')

    requiredJobs: (->
      jobs = @getPath('controller.build.jobs')
      jobs.filter((job) -> job.get('allow_failure') != true) if jobs
    ).property('controller.build.jobs')

    allowedFailureJobs: (->
      jobs = @getPath('controller.build.jobs')
      jobs.filter((job) -> job.get('allow_failure')) if jobs
    ).property('controller.build.jobs')

    urlBuild: (->
      Travis.Urls.build(@getPath('context.repository'), @get('context'))
    ).property('controller.build.repository.id', 'controller.build.id')


