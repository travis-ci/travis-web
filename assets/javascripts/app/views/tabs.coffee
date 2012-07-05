@Travis.Views.reopen
  TabsView: Em.View.extend
    templateName: 'repositories/tabs'

    repositoryBinding: 'controller.repository'
    buildBinding: 'controller.build'
    jobBinding: 'controller.job'
    tabBinding: 'controller.tab'

    toggleTools: ->
      $('#tools .pane').toggle()

    isBuildTab: (->
      tab = @getPath('tab')
      (tab == 'build' || tab == 'job') && @getPath('build.isLoaded')
    ).property('tab', 'build.isLoaded')

    isJobTab: (->
      @getPath('tab') == 'job' && @getPath('job.isLoaded')
    ).property('tab', 'job.isLoaded')

    # hrm. how to parametrize bindAttr?
    classCurrent: (->
      'active' if @getPath('tab') == 'current'
    ).property('tab')

    classBuilds: (->
      'active' if @getPath('tab') == 'builds'
    ).property('tab')

    classBuild: (->
      'active' if @getPath('tab') == 'build'
    ).property('tab')

    classJob: (->
      'active' if @getPath('tab') == 'job'
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


