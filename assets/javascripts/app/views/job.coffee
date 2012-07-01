@Travis.Views.reopen
  JobsView: Em.View.extend
    templateName: 'jobs/list'

  JobsItemView: Em.View.extend
    color: (->
      Travis.Helpers.colorForResult(@getPath('controller.result'))
    ).property('controller.result')

    urlJob: (->
      Travis.Urls.job(@getPath('context.repository'), @get('context'))
    ).property('context.repository', 'context')

  JobView: Em.View.extend
    templateName: 'jobs/show'

    color: (->
      Travis.Helpers.colorForResult(@getPath('controller.content.result'))
    ).property('controller.content.result')

    urlJob: (->
      Travis.Urls.job(@getPath('context.repository'), @get('context'))
    ).property('controller.content.repository.id', 'controller.content.id')

  LogView: Em.View.extend
    templateName: 'jobs/log'

