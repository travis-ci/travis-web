Travis.Views =
  ApplicationView: Em.View.extend
    templateName: 'application'

  RepositoriesView: Em.View.extend
    templateName: 'repositories/list'

  RepositoriesItemView: Em.View.extend
    classes: (->
      color   = Travis.Helpers.colorForResult(@getPath('repository.lastBuildResult'))
      classes = ['repository', color]
      classes.push 'selected' if @getPath('repository.selected')
      classes.join(' ')
    ).property('repository.lastBuildResult', 'repository.selected')

    lastBuild: (->
      owner: @getPath('repository.owner')
      name: @getPath('repository.name')
      id: @getPath('repository.lastBuildId')
    ).property('repository.owner', 'repository.name', 'repository.lastBuildId')

  RepositoryView: Em.View.extend
    templateName: 'repositories/show'

  TabsView: Em.View.extend
    templateName: 'repositories/tabs'

  HistoryView: Em.View.extend
    templateName: 'builds/list'

  BuildsItemView: Em.View.extend
    classes: (->
      Travis.Helpers.colorForResult(@getPath('content.result'))
    ).property('content.result')

  BuildView: Em.View.extend
    templateName: 'builds/show'

    classes: (->
      Helpers.colorForResult(@get('result'))
    ).property('result')

    isMatrix: (->
      @getPath('context.data.job_ids.length') > 1
    ).property() # TODO if i bind this to 'context.data.job_ids.length', that breaks the entire view (as if context was always undefined)

    requiredJobs: (->
      @getPath('context.jobs').filter((job) -> job.get('allow_failure') != true)
    ).property() # TODO same here with binding to 'context.data.job_ids'

    allowedFailureJobs: (->
      @getPath('context.jobs').filter((job) -> job.get('allow_failure'))
    ).property()

  JobsView: Em.View.extend
    templateName: 'jobs/list'

  JobView: Em.View.extend
    templateName: 'jobs/show'

    classes: (->
      Travis.Helpers.colorForResult(@get('result'))
    ).property('result')

  LogView: Em.View.extend
    templateName: 'jobs/log'

