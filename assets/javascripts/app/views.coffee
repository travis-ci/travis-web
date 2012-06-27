Travis.Views =
  ApplicationView: Em.View.extend
    templateName: 'application'

  RepositoriesView: Em.View.extend
    templateName: 'repositories/list'

  RepositoriesItemView: Em.View.extend
    classes: (->
      color   = Travis.Helpers.colorForResult(@getPath('context.lastBuildResult'))
      classes = ['repository', color]
      classes.push 'selected' if @getPath('context.selected')
      classes.join(' ')
    ).property('context.lastBuildResult', 'context.selected')

    lastBuild: (->
      owner: @getPath('context.owner')
      name: @getPath('context.name')
      build_id: @getPath('context.lastBuildId')
    ).property()

  RepositoryView: Em.View.extend
    templateName: 'repositories/show'

  TabsView: Em.View.extend
    templateName: 'repositories/tabs'

  HistoryView: Em.View.extend
    templateName: 'builds/list'

  BuildsItemView: Em.View.extend
    classes: (->
      Travis.Helpers.colorForResult(@getPath('context.result'))
    ).property('context.result')

  BuildView: Em.View.extend
    templateName: 'builds/show'

    classes: (->
      Helpers.colorForResult(@get('result'))
    ).property('result')

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

