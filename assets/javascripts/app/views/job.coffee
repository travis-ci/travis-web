@Travis.Views.reopen
  JobsView: Em.View.extend
    templateName: 'jobs/list'

    toggleHelp: ->
      $.facebox(div: '#allow_failure_help')

  JobsItemView: Em.View.extend
    jobBinding: 'context'
    repositoryBinding: 'context.repository'

    color: (->
      Travis.Helpers.colorForResult(@getPath('job.result'))
    ).property('job.result')

    urlJob: (->
      Travis.Urls.job(@getPath('repository.slug'), @getPath('job.id'))
    ).property('repository.slug', 'job.id')

  JobView: Em.View.extend
    templateName: 'jobs/show'

    jobBinding: 'controller.job'
    repositoryBinding: 'controller.repository'

    color: (->
      Travis.Helpers.colorForResult(@getPath('job.result'))
    ).property('job.result')

    urlJob: (->
      Travis.Urls.job(@getPath('repository.slug'), @get('job.id'))
    ).property('repository.slug', 'job.id')

  LogView: Em.View.extend
    templateName: 'jobs/log'

