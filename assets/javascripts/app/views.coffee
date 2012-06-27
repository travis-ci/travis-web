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

    urlRepository: (->
      Travis.Urls.repository(@get('context'))
    ).property('context')

    urlLastBuild: (->
      Travis.Urls.lastBuild(@get('context'))
    ).property('context')

  RepositoryView: Em.View.extend
    templateName: 'repositories/show'

  TabsView: Em.View.extend
    templateName: 'repositories/tabs'

    urlRepository: (->
      Travis.Urls.repository(@getPath('controller.repository'))
    ).property('controller.repository.id')

    urlBuilds: (->
      Travis.Urls.builds(@getPath('controller.repository'))
    ).property('controller.repository.id')

    urlBuild: (->
      Travis.Urls.build(@getPath('controller.repository'), @getPath('controller.build'))
    ).property('controller.repository.slug', 'controller.build.id')

    urlJob: (->
      Travis.Urls.job(@getPath('controller.repository'), @getPath('controller.job'))
    ).property('controller.repository.slug', 'controller.job.id')

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

