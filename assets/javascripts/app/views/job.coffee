@Travis.Views.reopen
  JobsView: Em.View.extend
    templateName: 'jobs/list'

  JobsItemView: Em.View.extend
    urlJob: (->
      Travis.Urls.job(@getPath('context.repository'), @get('context'))
    ).property('context.repository', 'context')

  JobView: Em.View.extend
    templateName: 'jobs/show'

    classes: (->
      Travis.Helpers.colorForResult(@get('result'))
    ).property('result')

    urlJob: (->
      Travis.Urls.job(@getPath('context.repository'), @get('context'))
    ).property('controller.content.repository.id', 'controller.content.id')

  LogView: Em.View.extend
    templateName: 'jobs/log'

