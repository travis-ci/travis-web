@Travis.Views.reopen
  TabsView: Em.View.extend
    templateName: 'repositories/tabs'

    toggleTools: ->
      $('#tools .pane').toggle()

    isBuildTab: (->
      tab = @getPath('controller.tab')
      (tab == 'build' || tab == 'job') && @getPath('controller.build.isLoaded')
    ).property('controller.tab', 'controller.build.isLoaded')

    isJobTab: (->
      @getPath('controller.tab') == 'job' && @getPath('controller.job.isLoaded')
    ).property('controller.tab', 'controller.job.isLoaded')

    # hrm. how to parametrize bindAttr?
    classCurrent: (->
      'active' if @getPath('controller.tab') == 'current'
    ).property('controller.tab')

    classBuilds: (->
      'active' if @getPath('controller.tab') == 'builds'
    ).property('controller.tab')

    classBuild: (->
      'active' if @getPath('controller.tab') == 'build'
    ).property('controller.tab')

    classJob: (->
      'active' if @getPath('controller.tab') == 'job'
    ).property('controller.tab')

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


