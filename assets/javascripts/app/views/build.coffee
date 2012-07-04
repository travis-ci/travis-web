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
      Travis.Helpers.colorForResult(@getPath('controller.content.result'))
    ).property('controller.content.result')

    requiredJobs: (->
      @getPath('controller.content.jobs').filter((job) -> job.get('allow_failure') != true)
    ).property('controller.content') # TODO same here with binding to 'context.data.job_ids'

    allowedFailureJobs: (->
      @getPath('controller.content.jobs').filter((job) -> job.get('allow_failure'))
    ).property('controller.content')

    urlBuild: (->
      Travis.Urls.build(@getPath('context.repository'), @get('context'))
    ).property('controller.content.repository.id', 'controller.content.id')


