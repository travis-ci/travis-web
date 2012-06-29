@Travis.Views.reopen
  HistoryView: Em.View.extend
    templateName: 'builds/list'

  BuildsItemView: Em.View.extend
    classes: (->
      Travis.Helpers.colorForResult(@getPath('context.result'))
    ).property('context.result')

    urlBuild: (->
      Travis.Urls.build(@getPath('context.repository'), @get('context'))
    ).property('context.repository.slug', 'context')

  BuildView: Em.View.extend
    templateName: 'builds/show'

    classes: (->
      Travis.Helpers.colorForResult(@get('result'))
    ).property('result')

    requiredJobs: (->
      @getPath('context.jobs').filter((job) -> job.get('allow_failure') != true)
    ).property() # TODO same here with binding to 'context.data.job_ids'

    allowedFailureJobs: (->
      @getPath('context.jobs').filter((job) -> job.get('allow_failure'))
    ).property()

    urlBuild: (->
      Travis.Urls.build(@getPath('context.repository'), @get('context'))
    ).property('controller.content.repository.id', 'controller.content.id')


