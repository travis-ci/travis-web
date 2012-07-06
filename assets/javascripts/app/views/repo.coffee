@Travis.reopen
  RepositoriesView: Em.View.extend
    templateName: 'repositories/list'

  RepositoriesItemView: Em.View.extend
    repositoryBinding: 'context'

    classes: (->
      $.compact(['repository', @get('color'), @get('selected')]).join(' ')
    ).property('color', 'selected')

    color: (->
      Travis.Helpers.colorForResult(@getPath('repository.lastBuildResult'))
    ).property('repository.lastBuildResult')

    selected: (->
      'selected' if @getPath('repository.selected')
    ).property('repository.selected')

    urlRepository: (->
      Travis.Urls.repository(@getPath('repository.slug'))
    ).property('repository.slug')

    urlLastBuild: (->
      Travis.Urls.build(@getPath('repository.slug'), @getPath('repository.lastBuildId'))
    ).property('repository.slug', 'repository.lastBuildId')

  RepositoryView: Em.View.extend
    templateName: 'repositories/show'

    repositoryBinding: 'controller.repository'
    buildBinding: 'controller.build'
    jobBinding: 'controller.job'
    tabBinding: 'controller.tab'

    toggleTools: ->
      $('#tools .pane').toggle()

    # hrm. how to parametrize bindAttr?
    classCurrent: (->
      'active' if @get('tab') == 'current'
    ).property('tab')

    classBuilds: (->
      'active' if @get('tab') == 'builds'
    ).property('tab')

    classBuild: (->
      tab = @get('tab')
      classes = []
      classes.push('active') if tab == 'build'
      classes.push('display') if tab == 'build' || tab == 'job'
      classes.join(' ')
    ).property('tab')

    classJob: (->
      'active display' if @get('tab') == 'job'
    ).property('tab')

    urlRepository: (->
      Travis.Urls.repository(@getPath('repository.slug'))
    ).property('repository.slug')

    urlBuilds: (->
      Travis.Urls.builds(@getPath('repository.slug'))
    ).property('repository.slug')

    urlBuild: (->
      Travis.Urls.build(@getPath('repository.slug'), @getPath('build.id'))
    ).property('repository.slug', 'build.id')

    urlJob: (->
      Travis.Urls.job(@getPath('repository.slug'), @getPath('job.id'))
    ).property('repository.slug', 'job.id')

    urlGithub: (->
      Travis.Urls.githubRepository(@getPath('repository.slug'))
    ).property('repository.slug'),

    urlGithubWatchers: (->
      Travis.Urls.githubWatchers(@getPath('repository.slug'))
    ).property('repository.slug'),

    urlGithubNetwork: (->
      Travis.Urls.githubNetwork(@getPath('repository.slug'))
    ).property('repository.slug'),

